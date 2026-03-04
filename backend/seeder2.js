const pool = require('./db')

const seeder2 = async () => {
    const questions = 
    [
  {
    "category": "Traffic Signs",
    "question": "What do traffic lights showing green mean, except when?",
    "correct_ans": [
      "Vehicle from right or stopped by police"
    ],
    "wrong_ans": [
      "When raining",
      "When tired",
      "Always go"
    ],
    "hint": "Green means go, except when there is an oncoming vehicle from the right or when stopped by police."
  },
  {
    "category": "Traffic Signs",
    "question": "What is another name given to a Give Way sign?",
    "correct_ans": [
      "Yield"
    ],
    "wrong_ans": [
      "Stop sign",
      "Caution sign",
      "Warning sign"
    ],
    "hint": "The Give Way sign is also called a Yield sign."
  },
  {
    "category": "Traffic Signs",
    "question": "What does AMBER which keeps flushing every now and then in the traffic lights mean?",
    "correct_ans": [
      "Control yourself, proceed with caution"
    ],
    "wrong_ans": [
      "Stop completely",
      "Speed up",
      "Turn around"
    ],
    "hint": "Flashing amber means control yourself and proceed with caution."
  },
  {
    "category": "Traffic Signs",
    "question": "Why is a STOP sign octagonal and a YIELD sign triangular (inverted)?",
    "correct_ans": [
      "To recognize in snow conditions or poor visibility"
    ],
    "wrong_ans": [
      "For decoration",
      "International standard only",
      "Random design"
    ],
    "hint": "To be able to recognize them in snow conditions or poor visibility by their unique shapes."
  },
  {
    "category": "Vehicle Maintenance",
    "question": "How often should you check tyre pressure?",
    "correct_ans": [
      "Weekly"
    ],
    "wrong_ans": [
      "Monthly",
      "Yearly",
      "Never"
    ],
    "hint": "Check tyre pressure at least once a week and before long journeys."
  },
  {
    "category": "Vehicle Maintenance",
    "question": "What is the minimum legal tread depth for tyres?",
    "correct_ans": [
      "1.6mm"
    ],
    "wrong_ans": [
      "1.0mm",
      "2.0mm",
      "3.0mm"
    ],
    "hint": "The minimum legal tread depth is 1.6mm across the central three-quarters of the tyre."
  },
  {
    "category": "Vehicle Maintenance",
    "question": "What are the four important tools you have to carry when driving for a safari?",
    "correct_ans": [
      "Car jack",
      "Spare wheel",
      "Spotlight",
      "Fire extinguisher"
    ],
    "wrong_ans": [],
    "hint": "Essential safari tools are car jack, spare wheel, spotlight, and fire extinguisher for emergencies."
  },
  {
    "category": "Vehicle Maintenance",
    "question": "What does the battery warning light indicate?",
    "correct_ans": [
      "Charging system problem"
    ],
    "wrong_ans": [
      "Low fuel",
      "Door open",
      "Seatbelt warning"
    ],
    "hint": "The battery warning light indicates a charging system problem. The alternator may not be charging the battery."
  },
  {
    "category": "Vehicle Maintenance",
    "question": "What should you do if your brakes fail while driving?",
    "correct_ans": [
      "Pump brake, engine braking, handbrake"
    ],
    "wrong_ans": [
      "Continue driving",
      "Turn off engine",
      "Accelerate"
    ],
    "hint": "Pump the brake pedal, use engine braking by shifting to lower gears, use handbrake gradually, and steer to safety."
  },
  {
    "category": "Vehicle Maintenance",
    "question": "Which is the strongest gear on a vehicle?",
    "correct_ans": [
      "Reverse gear - has no alternative gear"
    ],
    "wrong_ans": [
      "First gear",
      "Third gear",
      "Fifth gear"
    ],
    "hint": "Reverse gear is the strongest because it has no alternative gear and provides maximum torque."
  },
  {
    "category": "Vehicle Maintenance",
    "question": "What are the four important parts to be maintained in a car?",
    "correct_ans": [
      "Brakes",
      "Steering wheel",
      "Wheels",
      "Lights"
    ],
    "wrong_ans": [],
    "hint": "Critical maintenance parts are brakes, steering wheel, wheels (tires), and lights for safety."
  },
  {
    "category": "Vehicle Maintenance",
    "question": "What items must you carry in your vehicle?",
    "correct_ans": [
      "Fire extinguisher, triangle, first aid, spare wheel, jack"
    ],
    "wrong_ans": [
      "Only spare wheel",
      "Nothing required",
      "Just fire extinguisher"
    ],
    "hint": "Fire extinguisher, warning triangle, first aid kit, spare wheel, and jack."
  },
  {
    "category": "Traffic Signs",
    "question": "What does a green traffic light mean?",
    "correct_ans": [
      "Proceed if clear and safe"
    ],
    "wrong_ans": [
      "Stop completely",
      "Slow down",
      "Speed up"
    ],
    "hint": "A green light means you can proceed if the junction is clear and it is safe to do so."
  },
  {
    "category": "Traffic Signs",
    "question": "What rules apply to a yellow box junction?",
    "correct_ans": [
      "Do not enter unless clear. Exception: turn right if not obstructing"
    ],
    "wrong_ans": [
      "Never enter",
      "Always enter",
      "Enter only at night"
    ],
    "hint": "Do not enter unless your way ahead is clear. Exception: turning right, you can wait in box if not obstructing."
  },
  {
    "category": "Traffic Signs",
    "question": "What does a red traffic light mean?",
    "correct_ans": [
      "Stop completely"
    ],
    "wrong_ans": [
      "Proceed with caution",
      "Slow down",
      "Speed up"
    ],
    "hint": "A red light means you must stop completely before the stop line."
  },
  {
    "category": "Special Conditions",
    "question": "During night, if the oncoming vehicle does not dip the lights, what should you do?",
    "correct_ans": [
      "Slow down, flash 3 times, dip, possibly stop"
    ],
    "wrong_ans": [
      "Flash back brightly",
      "Speed up",
      "Ignore"
    ],
    "hint": "Slow down, flash your lights three times, dip them, and if possible stop."
  },
  {
    "category": "Special Conditions",
    "question": "Describe any indicators that may warn you of an accident ahead",
    "correct_ans": [
      "Warning signs, emergency vehicles, stopped/slow vehicles"
    ],
    "wrong_ans": [
      "Only sirens",
      "Nothing visible",
      "Only road signs"
    ],
    "hint": "Accident warning signs (lifesaver), emergency vehicles with flashlights, or several vehicles stopped/moving slowly."
  },
  {
    "category": "Lighting and Signals",
    "question": "You must dip your headlights when following another vehicle within 200 meters. True or False?",
    "correct_ans": [
      "True"
    ],
    "wrong_ans": [
      "False"
    ],
    "hint": "True. Dip your headlights to avoid dazzling the driver ahead through their rear-view mirror."
  },
  {
    "category": "Lighting and Signals",
    "question": "When can you put on the lights during the day?",
    "correct_ans": [
      "During heavy rainfall",
      "When it is misty",
      "During an emergency"
    ],
    "wrong_ans": [
      "When it is foggy"
    ],
    "hint": "Headlights should be used during the day in foggy conditions, heavy rain, mist, or during emergencies for visibility."
  },
  {
    "category": "Lighting and Signals",
    "question": "When should you use your indicators?",
    "correct_ans": [
      "Before turning, changing lanes, overtaking"
    ],
    "wrong_ans": [
      "When overtaking",
      "Never needed",
      "Only at night"
    ],
    "hint": "Before turning, changing lanes, overtaking, pulling over, or moving off from a stationary position."
  },
  {
    "category": "Overtaking",
    "question": "Where should you NOT overtake?",
    "correct_ans": [
      "Bend, junction, hill, bridge, white line, restricted view"
    ],
    "wrong_ans": [
      "Only at bends",
      "Anywhere",
      "Only junctions"
    ],
    "hint": "At bend, junction, brow of hill, humpback bridge, continuous white line, or where view of oncoming traffic is restricted."
  },
  {
    "category": "Overtaking",
    "question": "When can you overtake from the left?",
    "correct_ans": [
      "When vehicle ahead is turning right"
    ],
    "wrong_ans": [
      "On one-way road with multiple lanes",
      "When accident blocks right side",
      "Anytime"
    ],
    "hint": "Overtaking from left is allowed when vehicle ahead is turning right, on one-way roads with multiple lanes, or when accident blocks right side."
  },
  {
    "category": "Overtaking",
    "question": "What is the minimum distance you should maintain after overtaking before returning to the left lane?",
    "correct_ans": [
      "See their headlights in mirror"
    ],
    "wrong_ans": [
      "5 meters",
      "10 meters",
      "Immediately"
    ],
    "hint": "You should be able to see the overtaken vehicle's headlights in your rear-view mirror before returning to the left lane."
  },
  {
    "category": "Vehicle Maintenance",
    "question": "Why must all vehicles be insured?",
    "correct_ans": [
      "For security purposes"
    ],
    "wrong_ans": [
      "For decoration",
      "For speed",
      "For color"
    ],
    "hint": "Vehicle insurance is mandatory for security purposes and to cover damages in case of accidents."
  },
  {
    "category": "Vehicle Maintenance",
    "question": "Under-inflated tyres increase fuel consumption. True or False?",
    "correct_ans": [
      "True"
    ],
    "wrong_ans": [
      "False"
    ],
    "hint": "True. Under-inflated tyres increase rolling resistance, leading to higher fuel consumption and faster tyre wear."
  },
  {
    "category": "Traffic Signs",
    "question": "What does the green arrow filter on the traffic lights mean?",
    "correct_ans": [
      "Go in the direction shown by arrow"
    ],
    "wrong_ans": [
      "Stop",
      "Turn around",
      "Slow down"
    ],
    "hint": "You should go in the direction shown by the green arrow."
  },
  {
    "category": "Speed Limits",
    "question": "What speed should you maintain when approaching a roundabout?",
    "correct_ans": [
      "20-30 km/hr"
    ],
    "wrong_ans": [
      "50 km/hr",
      "No need to slow down",
      "80 km/hr"
    ],
    "hint": "Reduce speed to 20-30 km/hr or slower depending on size of roundabout and traffic conditions."
  },
  {
    "category": "Speed Limits",
    "question": "What is the maximum speed limit on the highway for cars?",
    "correct_ans": [
      "110 km/hr"
    ],
    "wrong_ans": [
      "80 km/hr",
      "100 km/hr",
      "120 km/hr"
    ],
    "hint": "Cars can travel up to 110 km/hr on Kenyan highways."
  },
  {
    "category": "Speed Limits",
    "question": "A speed governor is mandatory for all commercial vehicles. True or False?",
    "correct_ans": [
      "True"
    ],
    "wrong_ans": [
      "False"
    ],
    "hint": "True. All public service vehicles (PSVs) and commercial vehicles must have speed governors installed and functional."
  },
  {
    "category": "Speed Limits",
    "question": "What is the penalty for exceeding speed limits in Kenya?",
    "correct_ans": [
      "Fines and license suspension"
    ],
    "wrong_ans": [
      "Only a warning",
      "Nothing happens",
      "Just a fine"
    ],
    "hint": "Penalties include fines, license suspension, and in severe cases, imprisonment depending on the degree of violation."
  },
  {
    "category": "Speed Limits",
    "question": "Speed limits can be exceeded in case of medical emergency. True or False?",
    "correct_ans": [
      "False"
    ],
    "wrong_ans": [
      "True"
    ],
    "hint": "False. Even in emergencies, you should drive safely. Emergency vehicles with sirens have special privileges, not private vehicles."
  },
  {
    "category": "Speed Limits",
    "question": "What is the minimum speed limit on highways?",
    "correct_ans": [
      "No minimum, but don't drive too slowly"
    ],
    "wrong_ans": [
      "40 km/hr",
      "60 km/hr",
      "80 km/hr"
    ],
    "hint": "There is no minimum speed limit, but driving too slowly can be dangerous and cause traffic congestion."
  },
  {
    "category": "Speed Limits",
    "question": "What is the speed limit in a school zone during school hours?",
    "correct_ans": [
      "30 km/hr"
    ],
    "wrong_ans": [
      "20 km/hr",
      "50 km/hr",
      "40 km/hr"
    ],
    "hint": "The speed limit in school zones is typically 30 km/hr during school hours for safety of children."
  },
  {
    "category": "Speed Limits",
    "question": "What is the speed limit in residential areas?",
    "correct_ans": [
      "30-40 km/hr"
    ],
    "wrong_ans": [
      "50 km/hr",
      "80 km/hr",
      "60 km/hr"
    ],
    "hint": "The speed limit in residential areas is 30-40 km/hr to ensure safety of pedestrians."
  },
  {
    "category": "Right of Way",
    "question": "At a four-way stop, who has the right of way?",
    "correct_ans": [
      "First to arrive, or vehicle on right"
    ],
    "wrong_ans": [
      "The largest vehicle",
      "The fastest vehicle",
      "No rules apply"
    ],
    "hint": "The first vehicle to arrive at the stop has the right of way. If vehicles arrive simultaneously, the vehicle on the right has priority."
  },
  {
    "category": "Right of Way",
    "question": "Name four people in authority for whom you must stop",
    "correct_ans": [
      "Police officer",
      "School warden",
      "Flagman",
      "Person in charge of animals"
    ],
    "wrong_ans": [],
    "hint": "You must stop for a Garda (police officer), school warden, flagman, and person in charge of animals."
  },
  {
    "category": "Right of Way",
    "question": "Pedestrians always have the right of way at marked crossings. True or False?",
    "correct_ans": [
      "True"
    ],
    "wrong_ans": [
      "False"
    ],
    "hint": "True. Drivers must yield to pedestrians at marked pedestrian crossings."
  },
  {
    "category": "Right of Way",
    "question": "What is a pedestrian?",
    "correct_ans": [
      "A road user on foot"
    ],
    "wrong_ans": [
      "A cyclist",
      "A motorcyclist",
      "A driver"
    ],
    "hint": "A pedestrian is any road user who is traveling on foot."
  },
  {
    "category": "Right of Way",
    "question": "At an uncontrolled intersection, who has the right of way?",
    "correct_ans": [
      "Vehicle on the right"
    ],
    "wrong_ans": [
      "The faster vehicle",
      "Vehicle on the left",
      "The heavier vehicle"
    ],
    "hint": "The vehicle on the right has the right of way. If in doubt, yield to traffic already in the intersection."
  },
  {
    "category": "Right of Way",
    "question": "When merging onto a highway, who has the right of way?",
    "correct_ans": [
      "Vehicles already on highway"
    ],
    "wrong_ans": [
      "Merging vehicles",
      "Both have equal right",
      "Neither has priority"
    ],
    "hint": "Vehicles already on the highway have the right of way. Merging vehicles must yield and adjust their speed."
  },
  {
    "category": "Right of Way",
    "question": "What should you do when you hear a siren from an emergency vehicle?",
    "correct_ans": [
      "Pull over and stop"
    ],
    "wrong_ans": [
      "Speed up to get ahead",
      "Continue at same speed",
      "Honk back"
    ],
    "hint": "Pull over to the side of the road safely and stop to allow the emergency vehicle to pass."
  },
  {
    "category": "Overtaking",
    "question": "What must you NOT do when being overtaken?",
    "correct_ans": [
      "Accelerate"
    ],
    "wrong_ans": [
      "Slow down",
      "Maintain speed",
      "Move to the left"
    ],
    "hint": "When being overtaken, you should not accelerate - maintain or reduce speed to allow safe overtaking."
  },
  {
    "category": "Parking",
    "question": "What is the maximum distance your vehicle should be from the kerb when parked?",
    "correct_ans": [
      "Within 45 centimeters"
    ],
    "wrong_ans": [
      "1 meter",
      "2 meters",
      "No limit"
    ],
    "hint": "Your vehicle should be within 45 centimeters (about 1.5 feet) from the kerb."
  },
  {
    "category": "Parking",
    "question": "How close to a junction can you park?",
    "correct_ans": [
      "5 meters"
    ],
    "wrong_ans": [
      "1 meter",
      "3 meters",
      "10 meters"
    ],
    "hint": "You must park at least 5 meters away from a junction to ensure visibility and safety."
  },
  {
    "category": "Parking",
    "question": "What is a Clearway?",
    "correct_ans": [
      "Stopping and parking prohibited (except buses/taxis)"
    ],
    "wrong_ans": [
      "Free parking area",
      "Highway",
      "Pedestrian zone"
    ],
    "hint": "Stopping and parking are prohibited (except buses/taxis) for period shown on sign."
  },
  {
    "category": "Parking",
    "question": "What lights should you leave on when parked at night?",
    "correct_ans": [
      "Parking lights"
    ],
    "wrong_ans": [
      "No lights needed",
      "Full headlights",
      "Hazard lights"
    ],
    "hint": "Parking lights (side lights) should be left on when parked on a road at night."
  },
  {
    "category": "Parking",
    "question": "How far should you park from a fire hydrant?",
    "correct_ans": [
      "At least 3 meters"
    ],
    "wrong_ans": [
      "1 meter",
      "5 meters",
      "No restriction"
    ],
    "hint": "At least 3 meters away from a fire hydrant to allow emergency access."
  },
  {
    "category": "Parking",
    "question": "Yellow kerb markings mean no parking at any time. True or False?",
    "correct_ans": [
      "True"
    ],
    "wrong_ans": [
      "False"
    ],
    "hint": "True. Yellow kerb markings indicate no parking, no waiting, and in some areas no stopping."
  },
  {
    "category": "Lighting and Signals",
    "question": "Name the restrictions in relation to the use of the horn",
    "correct_ans": [
      "Not between 11:30 PM - 7:00 AM in built-up areas except emergency"
    ],
    "wrong_ans": [
      "No restrictions",
      "Never use",
      "Only in emergency"
    ],
    "hint": "Must not be used between 11:30 PM and 7:00 AM in built-up areas except in emergency."
  },
  {
    "category": "Parking",
    "question": "Name four places you can NOT stop?",
    "correct_ans": [
      "On a roundabout",
      "At the junction",
      "At the center of the road",
      "Where there is no stopping sign"
    ],
    "wrong_ans": [],
    "hint": "Stopping is prohibited on roundabouts, at junctions, at the center of the road, and where there are no stopping signs."
  },
  {
    "category": "Parking",
    "question": "Where should you NOT park?",
    "correct_ans": [
      "Bend, hill, bus stop, entrance"
    ],
    "wrong_ans": [
      "Anywhere is fine",
      "Only at bus stops",
      "Only on hills"
    ],
    "hint": "Near a bend, brow of a hill, bus stop, entrance/exit, where you would block signs or obstruct other vehicles."
  },
  {
    "category": "Junctions and Roundabouts",
    "question": "What is a box junction?",
    "correct_ans": [
      "Yellow criss-cross, don't enter unless exit clear"
    ],
    "wrong_ans": [
      "Parking area",
      "Speed zone",
      "Bus stop"
    ],
    "hint": "A box junction has yellow criss-cross lines. You must not enter unless your exit is clear, except when turning right."
  },
  {
    "category": "Junctions and Roundabouts",
    "question": "What is a staggered junction?",
    "correct_ans": [
      "Side roads at different points, need extra caution"
    ],
    "wrong_ans": [
      "Normal junction",
      "Roundabout",
      "T-junction"
    ],
    "hint": "A staggered junction has side roads on opposite sides of the main road at slightly different points, requiring extra caution."
  },
  {
    "category": "Junctions and Roundabouts",
    "question": "Which lane should you use at a roundabout to turn right?",
    "correct_ans": [
      "Right lane"
    ],
    "wrong_ans": [
      "Left lane",
      "Any lane",
      "Middle lane"
    ],
    "hint": "Use the right lane when approaching and on the roundabout until you need to change to the left lane to exit."
  },
  {
    "category": "Junctions and Roundabouts",
    "question": "Why should you look right twice when approaching a junction?",
    "correct_ans": [
      "Right side is near danger"
    ],
    "wrong_ans": [
      "Left side is dangerous",
      "Traffic lights",
      "Road signs"
    ],
    "hint": "Right side is the near danger side, so checking twice ensures safety before proceeding."
  },
  {
    "category": "Junctions and Roundabouts",
    "question": "At a T-junction, traffic on the main road has priority. True or False?",
    "correct_ans": [
      "True"
    ],
    "wrong_ans": [
      "False"
    ],
    "hint": "True. Traffic on the continuing road has priority over traffic joining from the side road."
  },
  {
    "category": "Junctions and Roundabouts",
    "question": "Name four common mistakes made when approaching a roundabout",
    "correct_ans": [
      "Wrong lane approach",
      "Changing lanes on roundabout",
      "Wrong lane exit",
      "Observing wrong side"
    ],
    "wrong_ans": [],
    "hint": "Common mistakes include wrong lane approach, changing lanes on roundabout, wrong lane exit, and observing wrong side."
  },
  {
    "category": "Junctions and Roundabouts",
    "question": "At a STOP sign which has no white line, where would you stop?",
    "correct_ans": [
      "At the STOP sign"
    ],
    "wrong_ans": [
      "Before the sign",
      "After the sign",
      "Anywhere"
    ],
    "hint": "At the STOP sign itself when there is no white line marked."
  },
  {
    "category": "Junctions and Roundabouts",
    "question": "How can a driver control himself in an uncontrolled roundabout?",
    "correct_ans": [
      "Check no vehicle from right side"
    ],
    "wrong_ans": [
      "Drive fast through it",
      "Always stop completely",
      "Sound horn"
    ],
    "hint": "Make sure there is no oncoming vehicle from the right side on the roundabout before entering."
  },
  {
    "category": "Junctions and Roundabouts",
    "question": "You should signal left when exiting a roundabout. True or False?",
    "correct_ans": [
      "True"
    ],
    "wrong_ans": [
      "False"
    ],
    "hint": "True. Signal left just after passing the exit before the one you intend to take."
  },
  {
    "category": "Lighting and Signals",
    "question": "When should you use hazard lights?",
    "correct_ans": [
      "Breakdown or emergency"
    ],
    "wrong_ans": [
      "When overtaking",
      "When speeding",
      "At night"
    ],
    "hint": "Use hazard lights when your vehicle is broken down, in an emergency, or to warn other drivers of a hazard ahead."
  },
  {
    "category": "Road Markings",
    "question": "What do white zig-zag lines on the road mean?",
    "correct_ans": [
      "Pedestrian crossing area, no overtaking or parking"
    ],
    "wrong_ans": [
      "Parking allowed",
      "Speed limit zone",
      "Bus lane"
    ],
    "hint": "White zig-zag lines indicate a pedestrian crossing area. No overtaking or parking allowed."
  },
  {
    "category": "Road Markings",
    "question": "What do white diagonal lines in the center of the road mean?",
    "correct_ans": [
      "Traffic island - do not enter (ghost island)"
    ],
    "wrong_ans": [
      "Parking area",
      "Overtaking zone",
      "Bus lane"
    ],
    "hint": "Treat them like a traffic island - you do not enter this ghost island area."
  },
  {
    "category": "Road Markings",
    "question": "What does a broken white line in the center of the road mean?",
    "correct_ans": [
      "May overtake if safe"
    ],
    "wrong_ans": [
      "No overtaking",
      "Bus lane",
      "Bicycle lane"
    ],
    "hint": "A broken white line means you may overtake if it is safe to do so."
  },
  {
    "category": "Road Markings",
    "question": "What does a double continuous line mean?",
    "correct_ans": [
      "Cannot cross to overtake, keep to your side"
    ],
    "wrong_ans": [
      "Can overtake anytime",
      "Parking zone",
      "Speed limit changes"
    ],
    "hint": "A double continuous line means you cannot cross to overtake - keep to your side."
  },
  {
    "category": "Road Markings",
    "question": "What is the meaning of a yellow-painted kerb?",
    "correct_ans": [
      "No parking, no waiting, sometimes no stopping"
    ],
    "wrong_ans": [
      "Parking allowed",
      "Loading zone",
      "Bus stop"
    ],
    "hint": "A yellow-painted kerb means no parking, no waiting, and in some places no stopping."
  },
  {
    "category": "Pedestrians and Crossings",
    "question": "What is a school warden?",
    "correct_ans": [
      "Person authorized to stop traffic for school children"
    ],
    "wrong_ans": [
      "Traffic police",
      "School teacher",
      "Security guard"
    ],
    "hint": "A school warden is a person authorized to stop traffic to allow school children to cross the road safely."
  },
  {
    "category": "Pedestrians and Crossings",
    "question": "What extra care should you take near parked ice cream vans?",
    "correct_ans": [
      "Children may run out, slow down and be vigilant"
    ],
    "wrong_ans": [
      "Speed up",
      "No special care needed",
      "Honk continuously"
    ],
    "hint": "Children may run out from behind the van without looking. Slow down and be extra vigilant."
  },
  {
    "category": "Pedestrians and Crossings",
    "question": "Describe your approach at a pedestrian crossing",
    "correct_ans": [
      "Be alert, speed to control and stop if needed"
    ],
    "wrong_ans": [
      "Speed up",
      "Sound horn",
      "Flash lights"
    ],
    "hint": "Be alert and at a speed at which you can control and stop in case of emergency."
  },
  {
    "category": "Pedestrians and Crossings",
    "question": "How would you know a Zebra crossing at night?",
    "correct_ans": [
      "Yellow flashing beacons"
    ],
    "wrong_ans": [
      "Street lights",
      "Road signs only",
      "Traffic lights"
    ],
    "hint": "By the yellow flashing beacons indicating the crossing location."
  },
  {
    "category": "Pedestrians and Crossings",
    "question": "What is a zebra crossing?",
    "correct_ans": [
      "Pedestrian crossing marked with black and white stripes"
    ],
    "wrong_ans": [
      "Vehicle crossing",
      "Animal crossing",
      "Bus stop"
    ],
    "hint": "A zebra crossing is a pedestrian crossing marked with black and white stripes where pedestrians have right of way."
  },
  {
    "category": "Pedestrians and Crossings",
    "question": "You must stop if a pedestrian is waiting at a zebra crossing. True or False?",
    "correct_ans": [
      "True"
    ],
    "wrong_ans": [
      "False"
    ],
    "hint": "True. You must stop and give way to pedestrians waiting to cross at a zebra crossing."
  },
  {
    "category": "Pedestrians and Crossings",
    "question": "What does the island in the center of a pedestrian crossing mean?",
    "correct_ans": [
      "Each side is a separate crossing"
    ],
    "wrong_ans": [
      "No crossing allowed",
      "Rest area",
      "Emergency stop"
    ],
    "hint": "Each side of the island is a separate crossing that must be treated individually."
  },
  {
    "category": "Pedestrians and Crossings",
    "question": "What is the name given to anybody carrying a sign of STOP CHILDREN CROSSING?",
    "correct_ans": [
      "School warden"
    ],
    "wrong_ans": [
      "Police officer",
      "Traffic controller",
      "Security guard"
    ],
    "hint": "A school warden is authorized to stop traffic for children crossing."
  },
  {
    "category": "Pedestrians and Crossings",
    "question": "Pedestrians walking on a road should walk facing oncoming traffic. True or False?",
    "correct_ans": [
      "True"
    ],
    "wrong_ans": [
      "False"
    ],
    "hint": "True. Pedestrians should walk on the right side of the road facing oncoming traffic to see vehicles approaching."
  },
  {
    "category": "Junctions and Roundabouts",
    "question": "When turning right at a junction, where should you position your vehicle?",
    "correct_ans": [
      "Right side of lane, check mirrors, signal"
    ],
    "wrong_ans": [
      "Far left",
      "Center",
      "Anywhere"
    ],
    "hint": "Position your vehicle to the right side of your lane, check mirrors, signal right, and wait for a safe gap in traffic."
  },
  {
    "category": "Junctions and Roundabouts",
    "question": "What position would you take up for a right turn at the end of a one-way street?",
    "correct_ans": [
      "Extreme right lane"
    ],
    "wrong_ans": [
      "Extreme left lane",
      "Center",
      "Any position"
    ],
    "hint": "When turning right at a junction, drive at the extreme right position."
  },
  {
    "category": "Accidents and Emergencies",
    "question": "What should you do after your vehicle has broken down?",
    "correct_ans": [
      "Push vehicle off road, hazard lights on, warning triangle 50m away"
    ],
    "wrong_ans": [
      "Leave vehicle in middle of road",
      "Wait for help in vehicle",
      "Drive slowly to nearest garage"
    ],
    "hint": "After breakdown, push vehicle off road if possible, put on hazard lights, and place warning triangle 50 meters away."
  },
  {
    "category": "Parking",
    "question": "You can park on the right side of the road facing oncoming traffic. True or False?",
    "correct_ans": [
      "False"
    ],
    "wrong_ans": [
      "True"
    ],
    "hint": "False. You must always park on the left side of the road in the direction of traffic flow."
  },
  {
    "category": "Road Markings",
    "question": "When can you cross a continuous white line?",
    "correct_ans": [
      "To avoid obstruction, for access, or broken line on your side"
    ],
    "wrong_ans": [
      "Never",
      "Anytime",
      "Only at night"
    ],
    "hint": "To avoid an obstruction, for access, or if there is a broken white line on your side."
  },
  {
    "category": "Overtaking",
    "question": "What must you NOT do when being overtaken?",
    "correct_ans": [
      "Accelerate"
    ],
    "wrong_ans": [
      "Slow down",
      "Maintain speed",
      "Move to the left"
    ],
    "hint": "When being overtaken, you should not accelerate - maintain or reduce speed to allow safe overtaking."
  },
  {
    "category": "Road Markings",
    "question": "What does a single continuous yellow line mean?",
    "correct_ans": [
      "No parking at certain times"
    ],
    "wrong_ans": [
      "No parking ever",
      "Loading zone",
      "Taxi rank"
    ],
    "hint": "A single continuous yellow line means no parking at certain times (generally during working hours)."
  },
  {
    "category": "Speed Limits",
    "question": "What is the maximum speed limit for trailers on the highway?",
    "correct_ans": [
      "65 km/hr"
    ],
    "wrong_ans": [
      "80 km/hr",
      "50 km/hr",
      "100 km/hr"
    ],
    "hint": "Trailers are limited to 65 km/hr on highways for safety."
  },
  {
    "category": "Road Markings",
    "question": "What does a broken yellow line mean?",
    "correct_ans": [
      "Edge of roadway (hard shoulder)"
    ],
    "wrong_ans": [
      "Center of road",
      "Bus stop",
      "Bicycle lane"
    ],
    "hint": "A broken yellow line indicates the edge of the roadway (hard shoulder)."
  },
  {
    "category": "Road Markings",
    "question": "If there are two parallel lines in the center of the road, one continuous and one broken, which do you obey?",
    "correct_ans": [
      "The line nearest to you"
    ],
    "wrong_ans": [
      "The continuous line",
      "The broken line",
      "Neither"
    ],
    "hint": "You obey the line nearest to you on your side of the road."
  },
  {
    "category": "Speed Limits",
    "question": "What is the maximum speed limit for pick-ups and lorries on the highway?",
    "correct_ans": [
      "80 km/hr"
    ],
    "wrong_ans": [
      "110 km/hr",
      "50 km/hr",
      "100 km/hr"
    ],
    "hint": "Pick-ups and lorries are limited to 80 km/hr on highways."
  },
  {
    "category": "Lighting and Signals",
    "question": "What should you do if dazzled by oncoming headlights?",
    "correct_ans": [
      "Slow down, look left, stop if necessary"
    ],
    "wrong_ans": [
      "Speed up",
      "Flash back",
      "Close eyes"
    ],
    "hint": "Slow down, look to the left edge of the road, and if necessary, stop until you can see clearly again."
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

