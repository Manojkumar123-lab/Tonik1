var sql = require("mssql");
var connect = function()
{
    var conn = new sql.ConnectionPool({
        user: 'sa',
        password: 'India@123',
        server: 'SRVPUN01BOMCCSV',
        database: 'I3_DOMINOS',
        
    });
 
    return conn;
};

module.exports = connect; //return functuion 