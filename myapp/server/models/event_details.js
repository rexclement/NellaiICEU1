const mongoose = require("mongoose");

const EventSchema = new mongoose.Schema({
    eventName: { type: String, required: true },
    year: { type: String, required: true },
    date: { type: String },
    place: { type: String },
    participants_count: { type: Number },
    flier: { type: String }, // Storing the image URL
    flier_public_id: { type: String },
    description: { type: String },
    outcome: { type: String },
    Accepted_Jesus: { type: Number },
    Non_Christian_Accept_Jesus: { type: Number },
    order: Number,
});

const eventdb = mongoose.model("Event", EventSchema);
module.exports.eventdb = eventdb;

const FellowshipSchema = new mongoose.Schema({
    eventName: { type: String, required: true },
    year: { type: String, required: true },
    date: { type: String },
    place: { type: String },
    flier: { type: String }, // Storing the image URL
    flier_public_id: { type: String },
    participants_count: { type: Number },
    description: { type: String },
    outcome: { type: String },
    NOSCTGIC: { type: Number }, // No of Students Committed to Grow In Christ
    order: Number,
});

const fellowshipdb = mongoose.model("Fellowship", FellowshipSchema);
module.exports.fellowshipdb = fellowshipdb;

const MissionSchema = new mongoose.Schema({
    eventName: { type: String, required: true },
    year: { type: String, required: true },
    date: { type: String },
    place: { type: String },
    flier: { type: String }, // Storing the image URL
    participants_count: { type: Number },
    description: { type: String },
    outcome: { type: String },
    TM: { type: Number },   // Tent Making
    FM: { type: Number },   // Full Time Ministry
    STC: { type: Number },  // Short Time Coordinator
    SMNI: { type: Number }, // Student Ministry in North India
    INLMBM: { type: Number }, // Interested in Learning More About Ministry
    order: Number,
});

const missiondb = mongoose.model("Mission", MissionSchema);
module.exports.missiondb = missiondb;
