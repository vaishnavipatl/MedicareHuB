import gql from 'graphql-tag'


const typeDefs = gql `
type AuthPayload1{
 token :String!
 user: User!
 role: String!
}

union User = Doctor | Patient | Pharmacy

type Doctor {
    id: ID!
    name: String!
    email: String!
    contact: String!
    medicalLicenseNumber: String!
    specialty: String!
    qualification: String!
    clinicAddress: String!
    visitingAddress: String!
  }

input RegisterDoctorInput {
    name: String!
    email: String!
    contact: String!
    password: String!
    medicalLicenseNumber: String!
    specialty: String!
    qualification: String!
    clinicAddress: String!
    visitingAddress: String!
  }
  
input LoginDoctorInput {
    email: String!
    password: String!
}


type Patient{
   id: ID!
   name:String!
   email:String!
   contact :String!
   password:String!
   address:String
}

input RegisterPatientInput {
    name: String!
    email: String!
    contact: String!
    password: String!
    address:String!
}
  
input LoginPatientInput {
    email: String!
    password: String!
}

type Pharmacy{
   name:String!
   email: String!
   contact:String!
   password:String!
   medicalLicenseNumber:String!
}

input RegisterPharmacyInput {
    name: String!
    email: String!
    contact: String!
    password: String!
    medicalLicenseNumber: String!
}
  
input LoginPharmacyInput {
    email: String!
    password: String!
}

type Appointment {
  id: ID!
  doctorId: ID!
  patientId: ID!
  patientName: String
  email: String
  contact: String
  preferredDate: String
  reason: String
  symptoms: String
  status: String 
  createdAt: String
}

type Reminder {
  id: ID!
  medicineName: String!
  delayMinutes: Int!  # How many minutes after creation to trigger reminder
  createdAt: String!  # Timestamp when reminder was created
  userId: ID!         # Owner of the reminder
}
input ReminderInput {
  medicineName: String!
  delayMinutes: Int!
}

 type Medicine {
    id: ID!
    medicineName: String!
    genericName: String
    brandName: String
    dosage: String
    sideEffects: String
    allergies: String
    price: Float!
    createdAt: String
  }
 input MedicineInput {
    medicineName: String!
    genericName: String
    brandName: String
    dosage: String
    sideEffects: String
    allergies: String
    price: Float!
  }

type Order {
  id: ID!
  medicine: Medicine!
  patient: Patient
  createdAt: String!
}

type Mutation {
    placeOrder(medicineId: ID!, patientId: ID!): Order!

    registerDoctor(input: RegisterDoctorInput!): AuthPayload1!
    loginDoctor(input:LoginDoctorInput):AuthPayload1!

    registerPatient(input:RegisterPatientInput!):AuthPayload1!
    loginPatient(input: LoginPatientInput!):AuthPayload1!

    registerPharmacy(input:RegisterPharmacyInput!):AuthPayload1!
    loginPharmacy(input: LoginPharmacyInput!):AuthPayload1!

    

    setReminder(input: ReminderInput!): Reminder!
    deleteReminder(id: ID!): Boolean! 
    addMedicine(input: MedicineInput!): Medicine
  

  createAppointment(
    doctorId: ID!
    patientId: ID!
    patientName: String
    email: String
    contact: String
    preferredDate: String
    reason: String
    symptoms: String
    previousAppointment: Boolean
  ): Appointment!

  respondToAppointment(appointmentId: ID!, status: String!): Appointment!
   
}


 
type Query{
  getAllMedicines: [Medicine!]!
  getMedicineById(id: ID!): Medicine!
  getAllOrders: [Order!]!  

  loggedInPatient: Patient
  myReminders: [Reminder!]!

  allDoctors:[Doctor!]!
  doctor(id: ID!): Doctor
  
  getAppointmentsByDoctor(doctorId: ID!): [Appointment!]!
  getAppointmentsByPatient(patientId: ID!): [Appointment!]!
  }


type Subscription {
 orderPlaced: Order!
  appointmentAdded(doctorId: ID!): Appointment!
}
`


export default typeDefs