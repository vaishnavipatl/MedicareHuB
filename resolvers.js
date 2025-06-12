import dotenv from 'dotenv';
dotenv.config();

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import Doctor from './models/Doctor.js';
import Patient from './models/Patient.js';
import Pharmacy from './models/Pharmacy.js';
import Appointment from './models/Appointment.js';
import Reminder from './models/Remainder.js';
import Medicine from './models/Medicine.js';
import Order from './models/Order.js'

import { PubSub } from 'graphql-subscriptions';
const pubsub = new PubSub();
const APPOINTMENT_ADDED = 'APPOINTMENT_ADDED';

const JWT_SECRET= process.env.JWT_SECRET


const resolvers ={
  User: {
    __resolveType(obj) {
      if (obj.specialty) return 'Doctor';
      if (obj.name) return 'Patient';
      if (obj.medicalLicenseNumber) return 'Pharmacy';
      return null;
    }
  },
  Doctor: {
    __isTypeOf(obj) {
      return obj.specialty !== undefined;
    }
  },
    Patient: {
    __isTypeOf(obj) {
      return obj.name !== undefined;
    }
  },

  Pharmacy:{
    __isTypeOf(obj) {
      return obj.medicalLicenseNumber !== undefined;
    }
  },

  Query:{
    getAllMedicines: async () => await Medicine.find(),
    getMedicineById: async (_, { id }) => await Medicine.findById(id),
    getAllOrders: async () => {
      const orders = await Order.find()
        .populate('medicine')
        .populate('patient')
        .sort({ createdAt: -1 });

        return orders.filter(order => order.patient && order.medicine);
    },
  
  getAppointmentsByDoctor: async (_, { doctorId }) => {
  try {
    const appointments = await Appointment.find({ doctorId }).sort({ createdAt: -1 });
    return appointments;
  } catch (error) {
    console.error('Error in getAppointmentsByDoctor:', error);
    throw new Error('Failed to fetch appointments');
  }
},

  getAppointmentsByPatient: async (_, { patientId }) => {
  try {
    const appointments = await Appointment.find({ patientId }).sort({ createdAt: -1 });
    return appointments;
  } catch (error) {
    console.error('Error in getAppointmentsByPatient:', error);
    throw new Error('Failed to fetch appointments');
  }
},

    allDoctors: async () => {
      return await Doctor.find({})
    },
    
    doctor: async (_, { id }) => {
      try {
        const doctor = await Doctor.findById(id);
        if (!doctor) {
          throw new Error('Doctor not found');
        }
        return doctor;
      } catch (error) {
        throw new Error(error.message);
      }
    },

loggedInPatient: async (_, __, context) => {
  const { userId, role } = context;
  // console.log("Context in resolver:", context);

  if (!userId || role !== 'patient') {
    throw new Error("Not authenticated as patient");
  }

  const patient = await Patient.findById(userId);
  // console.log("Fetched patient:", patient);

  if (!patient) {
    throw new Error("Patient not found");
  }
  return patient;
},
  

    myReminders: async (_, __, { userId }) => {
      if (!userId) throw new Error('Not authenticated');
      return await Reminder.find({ userId });
    },
    

    
  },

  Mutation: {
    createAppointment: async (_, args) => {
      const appt = new Appointment({...args});
      await appt.save();
      return appt;
    },
    respondToAppointment: async (_, { appointmentId, status }) => {
      const appt = await Appointment.findById(appointmentId);
      if (!appt) throw new Error('Not found');
      appt.status = status;
      await appt.save();
      return appt;
    },

    placeOrder: async (_, { medicineId, patientId }) => {
      const order = new Order({ medicine: medicineId, patient: patientId });
      return await order.save();
    },
    registerDoctor: async (_, { input }) => {
      const existing = await Doctor.findOne({ email: input.email });
      if (existing) throw new Error('Email already registered');

      const hashedPassword = await bcrypt.hash(input.password, 10);
      const newDoctor = new Doctor({ ...input, password: hashedPassword });
      await newDoctor.save();

      const token = jwt.sign({ id: newDoctor._id ,role:'doctor' }, JWT_SECRET, { expiresIn: '7d' });
      return { 
        token, 
        user:newDoctor,
        role:'doctor' };
    },

    
    loginDoctor: async (_, { input }) => {
      const existingDoctor = await Doctor.findOne({ email: input.email });
      if (!existingDoctor) throw new Error('Invalid credentials');

      const isMatch = await bcrypt.compare(input.password, existingDoctor.password);
      if (!isMatch) throw new Error('Invalid credentials');

      const token = jwt.sign({ id: existingDoctor._id ,role:'doctor' }, JWT_SECRET, { expiresIn: '7d' });
      return { 
        token, 
        user:existingDoctor,
        role:'doctor' 
      };
    },

    registerPatient: async (_, { input }) => {
      const existing = await Patient.findOne({ email: input.email });
      if (existing) throw new Error('Email already registered');

      const hashedPassword = await bcrypt.hash(input.password, 10);
      const newPatient = new Patient({ ...input, password: hashedPassword });
      await newPatient.save();

      const token = jwt.sign({ id: newPatient._id ,role:'patient' }, JWT_SECRET, { expiresIn: '7d' });
      return { 
        token, 
        user:newPatient,
        role:'patient' };
    },

    
    loginPatient: async (_, { input }) => {
      const existingPatient = await Patient.findOne({ email: input.email });
      if (!existingPatient) throw new Error('Invalid credentials');

      const isMatch = await bcrypt.compare(input.password, existingPatient.password);
      if (!isMatch) throw new Error('Invalid credentials');

      const token = jwt.sign({ id: existingPatient._id ,role:'patient' }, JWT_SECRET, { expiresIn: '7d' });
      return { 
        token, 
        user:existingPatient,
        role:'patient' 
      };
    },


    registerPharmacy: async (_, { input }) => {
      const existing = await Pharmacy.findOne({ email: input.email });
      if (existing) throw new Error('Email already registered');

      const hashedPassword = await bcrypt.hash(input.password, 10);
      const newPharmacy = new Pharmacy({ ...input, password: hashedPassword });
      await newPharmacy.save();

      const token = jwt.sign({ id: newPharmacy._id ,role:'pharmacy' }, JWT_SECRET, { expiresIn: '7d' });
      return { 
        token, 
        user:newPharmacy,
        role:'pharmacy' };
    },

    
    loginPharmacy: async (_, { input }) => {
      const existingPharmacy = await Pharmacy.findOne({ email: input.email });
      if (!existingPharmacy) throw new Error('Invalid credentials');

      const isMatch = await bcrypt.compare(input.password, existingPharmacy.password);
      if (!isMatch) throw new Error('Invalid credentials');

      const token = jwt.sign({ id: existingPharmacy._id ,role:'pharmacy' }, JWT_SECRET, { expiresIn: '7d' });
      return { 
        token, 
        user:existingPharmacy,
        role:'pharmacy' 
      };
    },

    setReminder: async (_, { input }, { userId }) => {
      if (!userId) throw new AuthenticationError('Not authenticated');
      const reminder = new Reminder({
        medicineName: input.medicineName,
        delayMinutes: input.delayMinutes,
        createdAt: new Date().toISOString(),
        userId,
      });
      await reminder.save();
      return reminder;
    },

    deleteReminder: async (_, { id }, { userId }) => {
      if (!userId) throw new AuthenticationError('Not authenticated');
      const reminder = await Reminder.findOneAndDelete({ _id: id, userId });
      return reminder ? true : false;
    },

    addMedicine: async (_, { input }) => {
      const newMedicine = new Medicine(input);
      return await newMedicine.save();
    },

   
  },

  Subscription: {
    orderPlaced: {
      subscribe: () => pubsub.asyncIterator(['ORDER_PLACED']),
    },

    appointmentAdded: {
      subscribe: (_, { doctorId }) => pubsub.asyncIterator(APPOINTMENT_ADDED),
      resolve: (payload, args) => {
        if (payload.appointmentAdded.doctorId.toString() === args.doctorId) {
          return payload.appointmentAdded;
        }
        return null; // skip if not for this doctor
      },
    },
  },

Order: {
    medicine: async (parent) => await Medicine.findById(parent.medicine),
    patient: async (parent) => await Patient.findById(parent.patient),
  }
  
}

export default resolvers