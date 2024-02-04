const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
mongoose.connect('mongodb://127.0.0.1:27017/Doctors');
const https = require("https");
const ejs = require("ejs");
const app = express();
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));



// schema for patients

const pat = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  age: {
    type: Number,
    required: true,
    unique: true
  },
 gender: {
    type: String,
    required: true
  },
  patdet: {
    type: String,
    required: true
  },
  contact: {
    type: String,
    required: true
  }
}, { timestamps: true });


  const Patient = mongoose.model("patients",pat);

// post for patients 

app.post('/patient-details', (req, res) => {

  console.log(req.body);
    
      // Create a new doctor instance using the request body
      const newPatient = new Patient({
        name: req.body.name,
        age: req.body.age,
        gender: req.body.gender,
        patdet:req.body.patient_dept_details,
        contact: req.body.contactNumber
      });
      // Save the new doctor to the database
       newPatient.save().then(()=>{
        console.log("saved patient details");
       }).catch(()=>{
        console.log("could not save the patient details")
       });
    });

// schema for doctors
const doc = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  appointments: [{
    Name: {
      type: String,
      required: true
    },
    age:{
      type:Number
    },
    patient_detail:{
      type:String
    },
    time_slot:{
      type:String
    },
    contact:{
      type:String
    }
  }],
  password: {
    type: String,
    required: true
  },
  specialization: {
    type: String,
    required: true
  },
  clinic_name: {
    type: String,
    required: true
  },
  clinicAddress: {
    type: String,
    required: true
  },
  contactNumber: {
    type: String,
    required: true
  }
}, { timestamps: true });


  const Doctor = mongoose.model("docters",doc);

  app.get("/",(req,res)=>{
    res.render("login");
});

app.get("/doctoring",(req,res)=>{
    res.render("doctor");
});

app.get("/patient_appointments/:id",(req,res)=>{
  console.log(req.params);
Doctor.findOne({name:req.params.id}).then((arr)=>{
res.render("patient_appointments",{pat_det:arr.appointments});
}).catch((err)=>{
  console.log(err);
  console.log("patient details");
});
});

app.get("/doctor/history",(req,res)=>{
res.render("history");
});

app.get("/patient",(req,res)=>{
  res.render("patient");
});

app.get("/doct",(req,res)=>{
  res.render("doct");
})
app.get("/pat",(req,res)=>{
  res.render("pat");
})
app.get("/patering",(req,res)=>{
  res.render("patient");
})

app.post("/doc-folio",(req,res)=>{
Doctor.findOne({name:req.body.username,password:req.body.password}).then((arr)=>{
  console.log("found doc page");
  res.render("docting",{doc:arr});
}).catch((err)=>{
  console.log(err);
  console.log("doc array");
});
});

app.post("/pat-folio",(req,res)=>{
  Patient.findOne({name:req.body.username,contact:req.body.password}).then((arr)=>{
    console.log("found doc page");
    res.render("pating",{pat:arr});
  }).catch((err)=>{
    console.log(err);
    console.log("pat array");
  });
  });

app.post("/book-patient",(req,res)=>{
Doctor.findOne({name:req.body.doc_name}).then((ar)=>{
  ar.appointments.push({
    Name:req.body.name,
    age:req.body.age,
    gender:req.body.gender,
    patient_detail:req.body.patient_dept_details,
    time_slot:req.body.slot,
    contact:req.body.contactNumber
  })
  ar.save().then(()=>{
    console.log("ok pushed");
    res.send("pushed the data");
  }).catch((err)=>{
    console.log(err);
    console.log("not ok not pushed");
  }).catch((err)=>{
    console.log(err);
    console.log("not fetched");
  });
});
});


app.get("/book/:id",(req,res)=>{
Doctor.findOne({name:req.params.id}).then((arr)=>{
  res.render("book",{doc_det:arr});
}).catch((err)=>{
  console.log(err);
  console.log("could not fetch book data");
})
});

//appointments page

app.get("/appointments",(req,res)=>{

Doctor.find().then((arr)=>{
  console.log(arr);
res.render("Appointments",{Doc_det:arr});
}).catch((err)=>{
  console.log(err);
  console.log("Could'nt display");
});

});

//appointments page


app.post('/doc-details', (req, res) => {

  console.log(req.body);
    
      // Create a new doctor instance using the request body
      const newDoctor = new Doctor({
        name: req.body.username,
        email: req.body.email,
        password: req.body.password,
        specialization: req.body.specialization,
        clinic_name:req.body.clinic_name,
        clinicAddress: req.body.clinic,
        contactNumber: req.body.contactNumber
      });
      // Save the new doctor to the database
       newDoctor.save().then(()=>{
        console.log("saved doctor details");
       }).catch(()=>{
        console.log("could not save the doctor details")
       });
    });

app.listen('3000',()=>{
    console.log("server is up on port " + 3000);
});