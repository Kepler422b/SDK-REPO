import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { faker } from '@faker-js/faker';
import Report from '../models/Report.js';
import dns from 'dns';

import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config({ path: path.join(path.dirname(fileURLToPath(import.meta.url)), '../.env') });

// Override local DNS to Google's Public DNS to fix ISP SRV blocking issues
dns.setServers(['8.8.8.8', '8.8.4.4']);

const states = [
    { state: 'Maharashtra', districts: ['Mumbai', 'Pune', 'Kolhapur', 'Raigad', 'Ratnagiri'] },
    { state: 'Kerala', districts: ['Wayanad', 'Idukki', 'Ernakulam', 'Alappuzha', 'Kottayam'] },
    { state: 'Uttarakhand', districts: ['Chamoli', 'Dehradun', 'Pithoragarh', 'Uttarkashi'] },
    { state: 'Assam', districts: ['Guwahati', 'Majuli', 'Dibrugarh', 'Silchar'] },
    { state: 'Odisha', districts: ['Puri', 'Cuttack', 'Balasore', 'Bhadrak', 'Khurda'] },
    { state: 'Gujarat', districts: ['Bhuj', 'Surat', 'Ahmedabad', 'Rajkot'] },
    { state: 'Bihar', districts: ['Patna', 'Muzaffarpur', 'Darbhanga', 'Gaya'] }
];

const disasterTypes = ['Flood', 'Earthquake', 'Cyclone', 'Heatwave', 'Landslide'];
const ngoTypes = ['Food', 'Medical', 'Rescue', 'Shelter', 'Other'];
const ngoNames = ['Goonj', 'Oxfam India', 'Save the Children', 'ActionAid India', 'Khalsa Aid', 'Indian Red Cross', 'World Vision', 'Care India', 'Mumbai Relief NGO', 'Mumbai Disaster Response Team'];
const problemsList = ['Communication breakdown', 'Roads blocked', 'Duplicate relief distribution', 'Shortage of drinking water', 'Power outage', 'Lack of medicine', 'Inadequate shelters'];
const solutionsList = ['Drone food delivery', 'Satellite phones for coordination', 'Centralized volunteer dashboard', 'Temporary Bailey bridges', 'Mobile medical camps'];

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB connected for seeding');
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

const disasterData = {
    'Flood': {
        summaries: [
            'Severe flooding caused by monsoon rains led to major drainage failures in urban areas.',
            'Rural communities isolated as river banks breached, requiring immediate boat rescue operations.',
            'Centralized relief camps established for displaced families with focus on drinking water and hygiene.'
        ],
        worked: ['Rapid deployment of NDRF boat teams', 'Effective use of social media for SOS tracking', 'Early warning sirens saved lives in low-lying areas'],
        failed: ['Drainage systems clogged with plastic waste', 'Delayed government compensation process', 'Shortage of high-capacity water pumps'],
        text: 'The heavy rainfall exceeded 200mm in 24 hours. Local reservoirs were forced to release water, leading to flash floods in several sub-districts. Emergency response teams coordinated with local NGOs to distribute over 5,000 food kits and provide temporary shelter in municipal schools.'
    },
    'Earthquake': {
        summaries: [
            'Magnitude 6.2 tremor caused structural damage to older residential buildings.',
            'Primary focus on debris clearance and checking structural integrity of critical infrastructure.',
            'Search and rescue operations successfully extracted 12 individuals from collapsed structures.'
        ],
        worked: ['Implementation of earthquake-resistant building codes in new sectors', 'Rapid structural assessment by expert geologists', 'Mobile medical units provided on-site trauma care'],
        failed: ['Old heritage buildings lacked seismic retrofitting', 'Panic during tremors led to stampede-like situations', 'Communication towers collapsed, hindering coordination'],
        text: 'The epicenter was located 50km from the district center. While modern buildings held up, several older structures suffered significant cracks. NDRF teams used advanced acoustic sensors to locate survivors. Local NGOs provided blankets and psychological support to affected families.'
    },
    'Cyclone': {
        summaries: [
            'High-velocity winds caused massive power outages and uprooted thousands of trees.',
            'Successful mass evacuation of coastal villages prevented significant loss of life.',
            'Restoration of power and telecommunication services is the current top priority.'
        ],
        worked: ['Satellite-based early warning system provided 48-hour lead time', 'Pre-emptive evacuation of 50,000 people to cyclone shelters', 'Availability of heavy-duty tree clearance equipment'],
        failed: ['Coastal embankments were breached in three locations', 'Saltwater intrusion damaged local standing crops', 'Back-up generators in hospitals failed due to fuel shortage'],
        text: 'Landfall occurred at approximately 4:00 PM with wind speeds reaching 150 km/h. The administration had successfully executed a mass evacuation plan on the previous day. Relief operations started within 2 hours of the eye passing, focusing on road clearance and power grid repairs.'
    },
    'Heatwave': {
        summaries: [
            'Record-breaking temperatures led to a spike in heat-related medical emergencies.',
            'Public cooling centers and hydration points established across busy marketplace areas.',
            'Modified school and office timings helped reduce exposure during peak heat hours.'
        ],
        worked: ['Cool roofs initiative in slum areas significantly reduced indoor temperatures', 'Aggressive public awareness campaign via SMS and radio', 'Free distribution of ORS and water at major transit hubs'],
        failed: ['Heavy load on power grid led to frequent rolling blackouts', 'Urban heat island effect exacerbated conditions in concrete-heavy sectors', 'Inadequate green cover in newer residential layouts'],
        text: 'Maximum temperatures touched 48 degrees Celsius for five consecutive days. The local health department reported a 30% increase in heatstroke cases. NGOs partnered with the municipal corporation to setup 200 temporary "Piyau" (water stations) and distributed umbrellas to outdoor workers.'
    },
    'Landslide': {
        summaries: [
            'Major landslide on national highway blocked primary supply routes to hilly regions.',
            'Ongoing debris removal operations hampered by continuous heavy drizzle.',
            'Relocation of families from high-risk slopes initiated by local authorities.'
        ],
        worked: ['Gully-plugging and retaining walls prevented further slope failure', 'Pre-deployment of heavy earth-moving equipment at high-risk spots', 'Local mountain rescue volunteers guided specialized teams'],
        failed: ['Illegal construction on steep slopes increased landslide vulnerability', 'Lack of slope stability sensors in critical zones', 'Secondary landslides occurred during the clearance process'],
        text: 'A massive slope failure occurred at Mile 42, burying approx 400 meters of the highway. State Disaster Response teams used drones to map the extent of the damage. Alternative routes were quickly identified for essential supplies, although travel time increased by 6 hours.'
    }
};

const generateReports = async () => {
    await Report.deleteMany(); // Clear existing
    console.log('Cleared existing reports');

    const reports = [];
    for (let i = 0; i < 150; i++) {
        const stateObj = faker.helpers.arrayElement(states);
        const state = stateObj.state;
        const district = faker.helpers.arrayElement(stateObj.districts);
        const disasterType = faker.helpers.arrayElement(disasterTypes);
        
        const typeData = disasterData[disasterType] || disasterData['Flood'];

        // Random subset of problems
        const faced = faker.helpers.arrayElements(problemsList, faker.number.int({ min: 1, max: 3 }));
        const solved = faker.helpers.arrayElements(solutionsList, faker.number.int({min: 1, max: 2}));

        const r = {
            title: `${disasterType} Relief Report - ${district}, ${state} ${faker.date.past({ years: 3 }).getFullYear()}`,
            disasterType,
            location: { state, district },
            date: faker.date.past({ years: 5 }),
            originalFileUrl: faker.image.urlLoremFlickr({ category: 'disaster' }),
            extractedText: typeData.text,
            aiSummary: faker.helpers.arrayElement(typeData.summaries),
            tags: [disasterType.toLowerCase(), ...faced.map(p => p.split(' ')[0].toLowerCase())],
            ngoDetails: {
                name: faker.helpers.arrayElement(ngoNames),
                type: faker.helpers.arrayElement(ngoTypes),
                areaOfOperation: [district, state],
                resourcesProvided: [faker.helpers.arrayElement(['Food kits', 'Tents', 'Medical supplies', 'Water purifiers'])]
            },
            volunteerDetails: {
                count: faker.number.int({ min: 10, max: 500 }),
                roles: ['Rescue', 'Logistics'],
                availability: 'Immediate'
            },
            assessment: {
                problemsFaced: faced,
                solutionsImplemented: solved,
                outcomes: {
                    whatWorked: faker.helpers.arrayElement(typeData.worked),
                    whatFailed: faker.helpers.arrayElement(typeData.failed),
                    recoveryEfficiency: faker.helpers.arrayElement(['Low', 'Medium', 'High'])
                }
            },
            detailedAnalysis: {
                executiveSummary: `This comprehensive mission report highlights the catastrophic impacts of the recent ${disasterType} event in ${district}. The damage scale has been assessed as severe, with significant disruption to regional supply chains and essential services. An official emergency declaration was issued within 6 hours of landfall, enabling the rapid mobilization of state and central resources. Fatalities were mitigated through aggressive early warning campaigns, though property damage remains extensive. The core mission focused on preserving life and stabilizing critical sectors.`,
                contextualOverview: `The event occurred on ${faker.date.past().toLocaleDateString()}, specifically impacting the ${district} region of ${state}. Measurable data indicates a surge well beyond historical averages, with ${disasterType === 'Earthquake' ? 'a Richter scale reading of ' + faker.number.float({min: 5, max: 7.5}).toFixed(1) : (disasterType === 'Flood' ? 'flood levels rising to ' + faker.number.float({min: 1.5, max: 4.5}).toFixed(1) + ' meters' : 'wind speeds peaking at 140 km/h')}. These levels triggered immediate secondary hazards, including soil erosion and localized power grid failure. The situational geography exacerbated response times in rural sub-districts.`,
                impactAssessment: `Initial surveys confirm a total affected population of approximately ${faker.number.int({min: 10000, max: 50000})} residents. Human casualties were recorded at ${faker.number.int({min: 2, max: 45})} with over ${faker.number.int({min: 100, max: 500})} reported injuries requiring hospitalization. The social impact is profound, with widespread displacement and long-term health risks associated with water-borne contaminants and psychological trauma. vulnerable groups, including children and the elderly, have been prioritized for medical triage and nutritional support.`,
                infrastructureDamage: `Infrastructure damage is widespread across ${district}, with critical lifelines such as the National Highway and local feeder roads severely compromised. Total structural failures include ${faker.number.int({min: 5, max: 20})} government buildings and hundreds of private residential units. Utilities remain the most affected sector, with over 78% of the district's power grid and water sanitation plants currently offline. Telecommunication towers in low-lying areas suffered complete structural collapse, necessitating the use of satellite communications for relief coordination.`,
                responseEfforts: `Rescue operations were spearheaded by the NDRF in collaboration with ${faker.helpers.arrayElement(ngoNames)}. Over ${faker.number.int({min: 500, max: 2000})} successful extractions were executed within the first 48 hours of the emergency. Relief efforts focused on establishing 24-hour community kitchens and mobile medical camps to treat acute injuries. Authorities implemented a tiered coordination strategy, utilizing volunteer networks for last-mile delivery of essential supplies including food, blankets, and hygiene kits.`,
                causesRiskFactors: `Post-disaster analysis reveals that the severity was exacerbated by several risk factors, including aging urban drainage systems and a lack of seismic retrofitting in older sectors. Environmental contexts, such as prolonged deforestation on nearby slopes, significantly increased the risk of secondary landslide events. Furthermore, underinvestment in local level flood-preparedness and early warning sensors in rural zones delayed the initial response curve. Strengthening these weak points is critical for future mission success.`,
                futureRecommendations: `To strengthen long-term resilience, it is imperative to implement a district-wide infrastructure audit focusing on 'Build Back Better' principles. Recommendations include the installation of real-time early warning sensors and the construction of multi-purpose disaster shelters in every sub-district. Investment must be prioritized for upgrading local sanitation and drainage networks to withstand climate-extreme events. Ongoing training for local volunteer groups and NGOs in advanced logistics and trauma care will ensure a more robust and rapid response in future scenarios.`
            }
        };
        reports.push(r);
    }

    try {
        await Report.insertMany(reports);
        console.log(`Successfully seeded ${reports.length} reports!`);
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

connectDB().then(generateReports);
