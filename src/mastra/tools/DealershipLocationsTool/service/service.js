import { columnSource } from "../Schema/columnSource.js";

export function buildSql(mObject) {
  const params = {};
  let paramCount = 0;

  // helper function -- helps with add any value to the params{}.
  const addParam = (val) => {
    const key = `p${paramCount++}`;
    params[key] = val;
    return `@${key}`;
  };

  // helper function -- helps with checking for columsn that are legit.
  const registerColumn = (col) => {
    if (col in columnSource) {
      return `${col}`;
    }
    console.alert("the column isnt a registered column"); 
  };

  // A. SELECT Clause
  const selectParts = [];
  const groupByCols = [];

  // Plain (un-aggregated) columns
  if (Array.isArray(mObject.columns) && mObject.columns.length > 0) {
    mObject.columns.forEach((col) => {
      const qualified = registerColumn(col);
      selectParts.push(`${qualified} AS ${col}`);;
      groupByCols.push(qualified);
    });
  }

  // Aggregated metrics (SUM, AVG, COUNT, etc.)
  if (Array.isArray(mObject.metrics) && mObject.metrics.length > 0) {
    mObject.metrics.forEach((m) => {
      const qualified = registerColumn(m.field);
      const alias = m.alias.replace(/[^a-zA-Z0-9_]/g, "");
      selectParts.push(`${m.aggregation}(${qualified}) AS ${alias}`);
    });
  }

  const selectClause = selectParts.length > 0 ? selectParts.join(", ") : "*";

  // B. WHERE Clause
  const whereParts = [];
  if (Array.isArray(mObject.filters)) {
    mObject.filters.forEach((f) => {
      const qualified = registerColumn(f.field);
      let op = (f.operator || "=").toUpperCase();
      let val = f.value;

      // Wrap wildcards whenever LIKE or NOT LIKE is used
      if (op.includes("LIKE") || op.includes("NOT LIKE")) {
        val = `%${val}%`;
      }

      const token = addParam(val);

      whereParts.push(`${qualified} ${op} ${token}`);
    });
  }
  const whereClause = whereParts.length > 0 ? `WHERE ${whereParts.join(" AND ")}` : "";
    
  // C. GROUP BY Clause
  // Only add GROUP BY if there are BOTH metrics AND un-aggregated columns
  let groupByClause = "";
  if (mObject.metrics && mObject.metrics.length > 0 && groupByCols.length > 0) {
    groupByClause = `GROUP BY ${groupByCols.join(", ")}`;
  }


  // D. ORDER BY Clause
  let orderClause = "";

  if (mObject.orderBy && mObject.orderBy.field) {
    const field = mObject.orderBy.field;
    const dir = (mObject.orderBy.direction || "DESC").toUpperCase() === "ASC" ? "ASC" : "DESC";

    // Check if it's an alias defined in metrics
    const metricAliases = (mObject.metrics || []).map((m) => m.alias);
    const isAlias = metricAliases.includes(field);

    if (isAlias) {
      // Aliases can be ordered directly without table prefixes
      const cleanAlias = field.replace(/[^a-zA-Z0-9_]/g, "");
      orderClause = `ORDER BY ${cleanAlias} ${dir}`;
    } else if (field in columnSource) {
      // If it's a known database column, register and qualify it (e.g. Students.grade)
      const qualified = registerColumn(field);
      orderClause = `ORDER BY ${qualified} ${dir}`;
    } else {
      // Unknown field, ignore or default
      console.warn(`Ignored invalid orderBy field: ${field}`);
    }
  }
  

  // E. Limit (MSSQL TOP)
  let rawLimit = parseInt(mObject.limit);
  if (isNaN(rawLimit) || rawLimit <= 0) {
    rawLimit = 20;
  }
  const safeLimit = Math.min(rawLimit, 50);
  const limitToken = addParam(safeLimit);

  const sql = `
    SELECT TOP (${limitToken}) ${selectClause}
    FROM DealershipLocations
    ${whereClause}
    ${groupByClause}
    ${orderClause};
  `.replace(/\s+/g, " ").trim();

  return { sql, params };
}