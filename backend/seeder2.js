const pool = require('./db')

const seeder2 = async () => {
    const questions = 
    [
    {
        "category": "Driving Techniques",
        "question": "What is the safest way to navigate a sharp curve?",
        "correct_ans": [
        "Slow before curve, look through it, accelerate gently on exit"
        ],
        "wrong_ans": [
        "Speed up before curve",
        "Brake on the curve",
        "Coast through"
        ],
        "hint": "Slow down before the curve, look through the curve where you want to go, and accelerate gently as you exit."
    },
    {
        "category": "Driving Techniques",
        "question": "When do you use the mirror when driving?",
        "correct_ans": [
        "When overtaking",
        "Changing lane",
        "Stopping"
        ],
        "wrong_ans": [
        "Only when reversing"
        ],
        "hint": "Use mirrors when overtaking, changing lanes, or stopping to check surroundings."
    },
    {
        "category": "Special Conditions",
        "question": "You should use high-beam headlights in fog. True or False?",
        "correct_ans": [
        "False"
        ],
        "wrong_ans": [
        "True"
        ],
        "hint": "False. Use dipped headlights or fog lights in fog. High beams reflect off fog and reduce visibility."
    },
    {
        "category": "Driving Techniques",
        "question": "Coasting (driving in neutral) saves fuel. True or False?",
        "correct_ans": [
        "False"
        ],
        "wrong_ans": [
        "True"
        ],
        "hint": "False. Coasting reduces vehicle control and modern engines cut fuel supply when decelerating in gear, making it less efficient."
    },
    {
        "category": "Driving Techniques",
        "question": "What is coasting?",
        "correct_ans": [
        "Driving in neutral"
        ],
        "wrong_ans": [
        "Driving downhill",
        "Driving for long with one gear",
        "Driving slowly"
        ],
        "hint": "Coasting is driving a vehicle for a long distance with one gear engaged."
    },
    {
        "category": "Basic Road Rules",
        "question": "What is the rule of the road in Kenya?",
        "correct_ans": [
        "Keep left unless overtaking"
        ],
        "wrong_ans": [
        "Keep right unless overtaking",
        "Drive in the middle",
        "Keep changing lanes"
        ],
        "hint": "In Kenya, vehicles must keep to the left side of the road unless overtaking."
    },
    {
        "category": "Basic Road Rules",
        "question": "What does a broken white line in the center of the road mean?",
        "correct_ans": [
        "You may overtake if safe"
        ],
        "wrong_ans": [
        "No overtaking allowed",
        "Road work ahead",
        "Speed limit zone"
        ],
        "hint": "You may overtake if it is safe to do so and you have clear visibility."
    },
    {
        "category": "Basic Road Rules",
        "question": "How many eyes does a driver have?",
        "correct_ans": [
        "Three (Two natural and one artificial)"
        ],
        "wrong_ans": [
        "Two",
        "Four",
        "One"
        ],
        "hint": "A driver has three eyes - two natural eyes and one artificial eye (the rear-view mirror)."
    },
    {
        "category": "Basic Road Rules",
        "question": "How many wheels does a saloon car have?",
        "correct_ans": [
        "Five (Four moving and one spare)"
        ],
        "wrong_ans": [
        "Four",
        "Six",
        "Three"
        ],
        "hint": "A saloon car has five wheels total - four moving wheels and one spare wheel."
    },
    {
        "category": "Basic Road Rules",
        "question": "What is the meaning of a solid white line in the center of the road?",
        "correct_ans": [
        "No overtaking or crossing allowed"
        ],
        "wrong_ans": [
        "You can overtake if clear",
        "Parking is allowed",
        "Slow traffic only"
        ],
        "hint": "A solid white line means no overtaking or crossing to the other side is allowed."
    },
    {
        "category": "Lighting and Signals",
        "question": "Where should you NOT hoot?",
        "correct_ans": [
        "Near a hospital",
        "Near a school",
        "Near law courts",
        "Where there is No Hooting sign"
        ],
        "wrong_ans": [],
        "hint": "Hooting is prohibited near hospitals, schools, law courts, and areas with \"No Hooting\" signs to maintain peace."
    },
    {
        "category": "Lighting and Signals",
        "question": "What arm signal indicates slowing down or stopping?",
        "correct_ans": [
        "Arm down, palm back, moving up and down"
        ],
        "wrong_ans": [
        "Arm up",
        "Arm forward",
        "Circular motion"
        ],
        "hint": "Extend your right arm downwards with palm facing backward, moving it up and down."
    },
    {
        "category": "Lighting and Signals",
        "question": "When driving at night, when should you dip your headlights?",
        "correct_ans": [
        "Only for oncoming traffic",
        "Oncoming traffic, following, well-lit roads, dawn/dusk, fog, junctions"
        ],
        "wrong_ans": [
        "Never dip",
        "Only in fog"
        ],
        "hint": "When meeting oncoming traffic, following closely, on well-lit roads, at dawn/dusk, in fog/snow, approaching junctions."
    },
    {
        "category": "Lighting and Signals",
        "question": "Which mechanical signal should we put on after being involved in a road accident in the middle of the road?",
        "correct_ans": [
        "Hazard lights"
        ],
        "wrong_ans": [
        "Left indicator",
        "Right indicator",
        "Reverse lights"
        ],
        "hint": "Hazard lights to warn other traffic of the stopped vehicle."
    },
    {
        "category": "Lighting and Signals",
        "question": "What does a flashing amber light at a pedestrian crossing mean?",
        "correct_ans": [
        "Approach with caution"
        ],
        "wrong_ans": [
        "Speed up",
        "Stop immediately",
        "Ignore it"
        ],
        "hint": "Approach with caution and be prepared to give way to pedestrians crossing or waiting to cross."
    },
    {
        "category": "Lighting and Signals",
        "question": "Using fog lights in clear conditions is illegal. True or False?",
        "correct_ans": [
        "True"
        ],
        "wrong_ans": [
        "False"
        ],
        "hint": "True. Fog lights should only be used in fog, heavy rain, or when visibility is seriously reduced."
    },
    {
        "category": "Lighting and Signals",
        "question": "What time do you usually switch on the lights in the evening?",
        "correct_ans": [
        "6:30 PM parking lights, 6:45 PM headlights"
        ],
        "wrong_ans": [
        "6:00 PM both",
        "7:00 PM both",
        "When completely dark"
        ],
        "hint": "6:30 PM for parking lights and 6:45 PM for headlights."
    },
    {
        "category": "Lighting and Signals",
        "question": "Reverse lights are white. True or False?",
        "correct_ans": [
        "True"
        ],
        "wrong_ans": [
        "False"
        ],
        "hint": "True. White reverse lights indicate that a vehicle is reversing or about to reverse."
    },
    {
        "category": "Lighting and Signals",
        "question": "What should you do if you are dazzled by the lights of an oncoming vehicle?",
        "correct_ans": [
        "Slow down and stop if necessary"
        ],
        "wrong_ans": [
        "Speed up",
        "Flash back",
        "Close eyes"
        ],
        "hint": "Slow down, stay on your side of the road, and be prepared to stop if necessary."
    },
    {
        "category": "Driving Techniques",
        "question": "What is the purpose of the MSM routine?",
        "correct_ans": [
        "Mirror-Signal-Manoeuvre"
        ],
        "wrong_ans": [
        "Music-Speed-Move",
        "Move-Stop-Monitor",
        "Map-Start-Move"
        ],
        "hint": "MSM (Mirror-Signal-Manoeuvre) is a routine to check mirrors, signal intentions, then execute the manoeuvre safely."
    },
    {
        "category": "Documents and Licensing",
        "question": "How often must commercial vehicles undergo inspection?",
        "correct_ans": [
        "Every 6 months"
        ],
        "wrong_ans": [
        "Annually",
        "Every 3 months",
        "Not required"
        ],
        "hint": "Commercial vehicles must undergo NTSA inspection every 6 months."
    },
    {
        "category": "Documents and Licensing",
        "question": "Name three documents which must be valid before you are allowed to drive",
        "correct_ans": [
        "Valid driving license",
        "Valid insurance certificate",
        "Valid vehicle inspection certificate",
        "Vehicle registration book"
        ],
        "wrong_ans": [],
        "hint": "Valid driving license, valid insurance certificate, and valid vehicle inspection certificate are required."
    },
    {
        "category": "Documents and Licensing",
        "question": "You must carry your driving license whenever you drive. True or False?",
        "correct_ans": [
        "True"
        ],
        "wrong_ans": [
        "False"
        ],
        "hint": "True. You must always have your driving license, insurance certificate, and vehicle inspection certificate when driving."
    },
    {
        "category": "Documents and Licensing",
        "question": "A PDL holder can carry passengers. True or False?",
        "correct_ans": [
        "False"
        ],
        "wrong_ans": [
        "True"
        ],
        "hint": "False. A Provisional Driving License (PDL) holder cannot carry passengers and must display \"L\" plates."
    },
    {
        "category": "Documents and Licensing",
        "question": "What does EAK on a driving license mean?",
        "correct_ans": [
        "East Africa Kenya"
        ],
        "wrong_ans": [
        "East African Kingdom",
        "Eastern Africa Kilifi",
        "Emergency Alert Kenya"
        ],
        "hint": "EAK means East Africa Kenya."
    },
    {
        "category": "Documents and Licensing",
        "question": "What happens if you drive without insurance?",
        "correct_ans": [
        "Fines, impoundment, license suspension"
        ],
        "wrong_ans": [
        "Nothing happens",
        "Just a warning",
        "Small fine only"
        ],
        "hint": "Driving without insurance is illegal and can result in fines, vehicle impoundment, and license suspension."
    },
    {
        "category": "Documents and Licensing",
        "question": "How long is a learner's permit valid for?",
        "correct_ans": [
        "12 months"
        ],
        "wrong_ans": [
        "6 months",
        "24 months",
        "18 months"
        ],
        "hint": "A learner's permit is valid for 12 months from the date of issue."
    },
    {
        "category": "Traffic Signs",
        "question": "If the traffic lights are green but you are stopped by a police officer, who should you obey?",
        "correct_ans": [
        "Police officer (under mandatory authority)"
        ],
        "wrong_ans": [
        "Traffic light",
        "Other drivers",
        "Your judgment"
        ],
        "hint": "Obey the police officer because they are under mandatory authority and override traffic signals."
    },
    {
        "category": "Traffic Signs",
        "question": "If you saw a red triangle on the road, what would it mean?",
        "correct_ans": [
        "Obstruction on road ahead"
        ],
        "wrong_ans": [
        "Road works",
        "School zone",
        "Speed limit"
        ],
        "hint": "That there is an obstruction on the road ahead - warning triangle."
    },
    {
        "category": "Traffic Signs",
        "question": "What does an amber traffic light mean?",
        "correct_ans": [
        "Stop if safe to do so"
        ],
        "wrong_ans": [
        "Go faster",
        "Proceed with caution",
        "Turn left only"
        ],
        "hint": "An amber light means stop if you can do so safely at the stop line."
    }
    ]

    for (const quesion of questions) {
        const categor = quesion.category;
        const quest = quesion.question;
        const correct = quesion.correct_ans;
        const wrong = quesion.wrong_ans;
        const hint = quesion.hint;
        try {
            await pool.query ('INSERT INTO theory (category, question, correct_ans, wrong_ans, hint) VALUES ($1, $2, $3, $4, $5 )', [categor, quest, correct, wrong, hint])
            console.log('Seed Successful')
        } catch (error) {
            console.error('Failed to seed db')
        }
    }
}

seeder2();

