const express = require('express') //for manage the server
const app = express() // for create the server
const mysql = require('mysql'); // import mysql for database connection
const cors = require('cors') // for manage the cors error (cross origin resource sharing)

app.use(express.json()); // for manage the json data
app.use(cors()); // for manage the cors error (cross origin resource sharing)
const connection = mysql.createConnection({ // create the connection with database
    host: 'localhost', // host name
    user: 'root', // database user
    password: '', // database password
    database: 'gatepass_management' // database name
});

connection.connect(); // connect with database

connection.query('SELECT * from user', function (error, results, fields) {
    if (error) throw error;
    console.log('The solution is: ', results);
});


app.get('/get-all-users', (req, res) => {
    connection.query('SELECT * from user', function (error, results, fields) {
        res.status(200).json({ message: 'All users', data: results })
        if (error) throw error;
        console.log('The solution is: ', results);
    });
})


app.post('/add-user', (req, res) => {

    const { name, email, password, role, company, employee_code, created_at, created_by, updated_at, updated_by, status } = req.body;

    // const name = 'FARHAN'
    //  const email = 'farhan@gmail.com'
    //    const password = '@123'
    //      const role = 'admin'
    //        const company = 'gatepass'
    //          const employee_code = '123'
    //             const created_at = '2021-09-01'
    //               const created_by = 'mansoor'
    //                 const updated_at = '2021-09-01'
    //                   const updated_by = 'mansoor'
    //                     const status = 'active'
    connection.query(`INSERT INTO user 
    (name, email, password, role, company, employee_code, created_at, created_by, updated_at, updated_by, status)

       VALUES 
            ('${name}', '${email}', '${password}', '${role}', '${company}', '${employee_code}', '${created_at}', '${created_by}', '${updated_at}', '${updated_by}', '${status}')`, function (error, results, fields) {

        if (error) throw error;


        res.status(200).json({ message: 'User Added Successfully', data: results })
    });
})

//login route
app.post('/user-login', (req, res) => {

    const { email, password } = req.body;
    // const {email,password } = req.body;
    // const email = 'mansoor@gmail.com'
    //   const password = 'mansoor@1'

    connection.query(`SELECT * FROM user where email ='${email}' and PASSWORD = '${password}' `,


        function (error, results, fields) {

            // res.status(200).json({ message: 'Login APi working successfully', data: 123 })

            if (results.length == 0) {
                res.status(200).json({ message: 'User Not Found', data: results })
            }

            res.status(200).json({ message: 'Login APi working successfully', data: results })
        });
})


// api for home page start date 1/23/2025;
app.post('/insert-inward-gatepass', (req, res) => {
    const { date, time_in, vehicle_no, delivered_by, supplier_name, raw_material_purchase, sales_return, transfer, po_no, grn_no, transfer_no, dcbil_no, mr_no, fixed_assets_purchase, consumable_purchase, returnable, created_at, created_by, updated_by, updated_at, status, inward_gate_pass_code } = req.body;

    if (!date || !time_in || !vehicle_no || !delivered_by || !supplier_name || !raw_material_purchase || !sales_return || !transfer || !po_no || !grn_no || !transfer_no || !dcbil_no || !mr_no || !fixed_assets_purchase || !consumable_purchase || !returnable || !created_at || !created_by || !updated_by || !updated_at || !status || !inward_gate_pass_code) {
        return res.status(400).json({ message: 'Please fill all the fields' })
    }
    if (raw_material_purchase !== 0 || raw_material_purchase !== 1) {
        return res.status(400).json({ message: 'raw_material_purchase field should be either 0 or 1' })
    }



    connection.query(`INSERT INTO inward_gate_pass ( date, time_in, vehicle_no, delivered_by, supplier_name, raw_material_purchase, sales_return, transfer, po_no, grn_no, transfer_no, dcbil_no, mr_no, fixed_assets_purchase, consumable_purchase, returnable, created_at, created_by, updated_by, updated_at, status,  inward_gate_pass_code)    
        VALUES  ('${date}','${time_in}','${vehicle_no}', '${delivered_by}','${supplier_name}','${raw_material_purchase}','${sales_return}','${transfer}','${po_no}','${grn_no}','${transfer_no}','${dcbil_no}','${mr_no}','${fixed_assets_purchase}','${consumable_purchase}','${returnable}','${created_at}','${created_by}','${updated_by}','${updated_at}','${status}', 
        '${inward_gate_pass_code}')`,
        function (error, results, fields) {

            if (error) throw error;

            res.status(200).json({ message: 'Data Inserted Successfully', data: results })
        })

});

app.get('/get-inward-gatepass', (req, res) => {

    try {
        connection.query('SELECT * FROM inward_gate_pass ', function (error, results, fields) {
            res.status(200).json({ message: 'all gate pass data', data: results })
            if (error) throw error;
            console.log('The solution is: ', results);

        });

    } catch (error) {
        res.status(500).json({ message: 'Error fetching data', data: error.message })
    }
})

// app.post('/get-inward-gatepass', (req,res) =>{
//     const {description,item_code,quantity} = req.body;
//     connection.query( `INSERT INTO inward_gatepass_detail ( description , item_code, quantity)
//     VALUES ('${description}','${item_code}','${quantity}' )`,
//})

try {
    app.post("/post-inward-detials", (req, res) => {
        const { description, item_code, quantity, inward_gate_pass_code } = req.body;

        connection.query(`INSERT INTO inward_gatepass_detail ( description , item_code, quantity , inward_gate_pass_code) VALUES ('${description}','${item_code}','${quantity}' ,'${inward_gate_pass_code}')`)
        res.status(200).json({ message: 'data inserted successfully', data: req.body })
    })
} catch (error) {
    res.status(500).json({ message: 'internal server error', data: error.message })

}

try{
app.get('/get-inward-detials-tb', (req, res) => {
    connection.query(`SELECT * FROM inward_gatepass_detail `, function (error, results, fields) {
        res.status(200).json({ message: ' all home page data', data: results })
        if (error) throw error;
        console.log('The solution is: ', results);
    })


})
}catch(error){
    res.status(500).json({ message: 'internal server error', data: error.message })
}


// INSERT INTO inward_gatepass_detail ( description , item_code, quantity) 
// VALUES ('Steel Rods', 'ST-001', 50);


try {
app.post('/add-data-staff', (req, res) => {
    const {
        date,
        department,
        name,
        code,
        is_official,
        is_personal,
        time_out,
        expected_time_in,
        purpose_ofoffichial_visit,
        location_of_visit,
        staff,
        hod,
        recived_by

    } = req.body;
    console.log("payload", req.body);



    connection.query(`INSERT INTO staff_gatepass (date, department, name, code, is_official, is_personal, time_out, expected_time_in, purpose_ofoffichial_visit,  location_of_visit, staff, hod, recived_by)
        VALUES ('${date}','${department}','${name}','${code}','${is_official}','${is_personal}','${time_out}','${expected_time_in}','${purpose_ofoffichial_visit}','${location_of_visit}','${staff}','${hod}', '${recived_by}'  ) `, function (error, results, fields) {
        if (error) throw error;
        res.status(200).json({ message: 'data inserted successfully', data: results })
    });

})
}catch(error){
    res.status(500).json({ message: 'internal server error', data: error.message })
}



// app.post('/get-data-staff', (req, res ) => {

//     connection.query(` SELECT * FROM  staff_gatepass `, function (error, results, fields) {
//         res.status(200).json({ message: ' all home page data', data: results }) 
//         if (error) throw error;
//         console.log('The solution is: ', results);
//     } )


// }

try{

app.get('/get-data-staff', (req, res) => {
    connection.query(`SELECT * FROM staff_gatepass`, function (error, results, fields) {
        if (error) {
            console.error('Database error:', error);
            return res.status(500).json({ message: 'Database error', error });
        }
        res.status(200).json({ message: 'All staff data', data: results });
    });
});

} catch(error){
    res.status(500).json({ message: `internal server error`, data: error.message })
}

try{
    app.get('/get-table-row/:inward_gate_pass_code', (req, res) => {
        const { inward_gate_pass_code } = req.params;

    if (!inward_gate_pass_code || inward_gate_pass_code.trim() === '') {
         res.status(400).json({ message: "Code is required" });
    }
    connection.query(`SELECT * FROM inward_gatepass_detail WHERE inward_gate_pass_code='${inward_gate_pass_code}'`, function (error, results, fields) {
        if (error) {
            console.error('Database error:', error);
            return res.status(500).json({ message: 'Database error', error });
        }

        console.log('The code  is:  ', inward_gate_pass_code);
        res.status(200).json({ message: 'All staff data', data: results });
    });

});

}catch(error){
    res.status(500).json({ message: `internal server error`, data: error.message })
}



app.listen(5500, () => {
    console.log('Server is running on port 5500')
})


