import { ExerciseDatabaseItem, ExerciseCategory } from '../types';

export const WORLD_EXERCISE_DATABASE: ExerciseDatabaseItem[] = [
  // ==========================================
  // CARDIO & AEROBICS
  // ==========================================
  {
    id: 'ex-cardio-1',
    name: 'Brisk Walking (5-6 km/h)',
    category: 'cardio',
    met: 4.3,
    intensity: 'moderate',
    targetMuscles: ['Calves', 'Quadriceps', 'Hamstrings', 'Glutes'],
    equipment: 'Walking Shoes',
    description: 'Energetic, fast-paced walking with active arm swing. Ideal for cardiovascular endurance, fat loss, and joint longevity.',
    caloriesPerMin70kg: 5.3,
    benefits: 'Low impact on knees, reduces blood pressure, improves insulin sensitivity.',
    youtubeUrl: 'https://www.youtube.com/watch?v=njeZ29umqVE',
    youtubeVideoId: 'njeZ29umqVE'
  },
  {
    id: 'ex-cardio-2',
    name: 'Outdoor Running / Jogging (8.5 km/h)',
    category: 'cardio',
    met: 8.3,
    intensity: 'high',
    targetMuscles: ['Quadriceps', 'Hamstrings', 'Calves', 'Core', 'Glutes'],
    equipment: 'Running Shoes',
    description: 'Sustained aerobic running maintaining a rhythmic breathing pattern. Highly effective for VO2 max and calorie expenditure.',
    caloriesPerMin70kg: 10.2,
    benefits: 'Strengthens cardiac muscles, enhances lung capacity, burns high calories.',
    youtubeUrl: 'https://www.youtube.com/watch?v=_kGESn8ArrU',
    youtubeVideoId: '_kGESn8ArrU'
  },
  {
    id: 'ex-cardio-3',
    name: 'High-Speed Sprint Intervals',
    category: 'cardio',
    met: 12.5,
    intensity: 'vigorous',
    targetMuscles: ['Glutes', 'Hamstrings', 'Quadriceps', 'Calves', 'Abs'],
    equipment: 'Running Track / Turf',
    description: 'Maximal effort all-out sprint repetitions alternating with recovery walks.',
    caloriesPerMin70kg: 15.3,
    benefits: 'Boosts explosive power, triggers EPOC afterburn, stimulates human growth hormone.',
    youtubeUrl: 'https://www.youtube.com/watch?v=6mhy8k_v1eM',
    youtubeVideoId: '6mhy8k_v1eM'
  },
  {
    id: 'ex-cardio-4',
    name: 'Cycling (Outdoor Moderate Pace 19-22 km/h)',
    category: 'cardio',
    met: 8.0,
    intensity: 'high',
    targetMuscles: ['Quadriceps', 'Glutes', 'Hamstrings', 'Calves'],
    equipment: 'Bicycle, Helmet',
    description: 'Continuous road or trail bicycling at a steady, heart-elevating pace.',
    caloriesPerMin70kg: 9.8,
    benefits: 'Zero joint impact, builds lower-body endurance, great for commute fitness.',
    youtubeUrl: 'https://www.youtube.com/watch?v=nmnv33aWbC8',
    youtubeVideoId: 'nmnv33aWbC8'
  },
  {
    id: 'ex-cardio-5',
    name: 'Stationary Spin Bike (Intervals)',
    category: 'cardio',
    met: 8.5,
    intensity: 'high',
    targetMuscles: ['Quadriceps', 'Glutes', 'Hip Flexors', 'Calves'],
    equipment: 'Stationary / Spin Bike',
    description: 'Indoor cycling alternating high-resistance hill climbs and rapid cadence sprints.',
    caloriesPerMin70kg: 10.4,
    benefits: 'Controlled indoor cardio, safe for all weather conditions, adjustable resistance.',
    youtubeUrl: 'https://www.youtube.com/watch?v=l_kYh_G4k1g',
    youtubeVideoId: 'l_kYh_G4k1g'
  },
  {
    id: 'ex-cardio-6',
    name: 'Swimming (Freestyle / Front Crawl)',
    category: 'cardio',
    met: 9.8,
    intensity: 'vigorous',
    targetMuscles: ['Lats', 'Shoulders', 'Chest', 'Core', 'Glutes', 'Legs'],
    equipment: 'Swimming Pool, Goggles',
    description: 'Continuous lap swimming utilizing alternating arm strokes and flutter kicks.',
    caloriesPerMin70kg: 12.0,
    benefits: 'Total-body resistance, zero impact on joints, strengthens entire respiratory system.',
    youtubeUrl: 'https://www.youtube.com/watch?v=SONx52cyltI',
    youtubeVideoId: 'SONx52cyltI'
  },
  {
    id: 'ex-cardio-7',
    name: 'Swimming (Breaststroke / Leisurely)',
    category: 'cardio',
    met: 5.3,
    intensity: 'moderate',
    targetMuscles: ['Inner Thighs', 'Pectorals', 'Upper Back', 'Core'],
    equipment: 'Swimming Pool',
    description: 'Synchronized arm sweep and frog-kick swimming suitable for recovery and endurance.',
    caloriesPerMin70kg: 6.5,
    benefits: 'Gentle whole-body workout, expands chest and shoulder mobility.',
    youtubeUrl: 'https://www.youtube.com/watch?v=QGZ8rIy-Mvg',
    youtubeVideoId: 'QGZ8rIy-Mvg'
  },
  {
    id: 'ex-cardio-8',
    name: 'Jump Rope (Speed & Rhythm)',
    category: 'cardio',
    met: 11.8,
    intensity: 'vigorous',
    targetMuscles: ['Calves', 'Forearms', 'Shoulders', 'Core', 'Quadriceps'],
    equipment: 'Jump Rope',
    description: 'Fast-paced rhythmic rope jumping on the balls of the feet with tight wrist rotations.',
    caloriesPerMin70kg: 14.5,
    benefits: 'Unmatched conditioning, improves footwork and agility, massive calorie burn.',
    youtubeUrl: 'https://www.youtube.com/watch?v=u3zgHI8YCyo',
    youtubeVideoId: 'u3zgHI8YCyo'
  },
  {
    id: 'ex-cardio-9',
    name: 'Rowing Machine (Ergometer)',
    category: 'cardio',
    met: 8.5,
    intensity: 'high',
    targetMuscles: ['Back (Lats/Rhomboids)', 'Legs (Quads/Hamstrings)', 'Arms', 'Core'],
    equipment: 'Rowing Ergometer',
    description: 'Full-body kinetic chain pulling exercise engaging 85% of the body muscle mass.',
    caloriesPerMin70kg: 10.4,
    benefits: 'Combines strength and cardiovascular conditioning in a single smooth movement.',
    youtubeUrl: 'https://www.youtube.com/watch?v=H0AAFXTKCSg',
    youtubeVideoId: 'H0AAFXTKCSg'
  },
  {
    id: 'ex-cardio-10',
    name: 'Stair Climbing / Stairmaster',
    category: 'cardio',
    met: 9.0,
    intensity: 'high',
    targetMuscles: ['Glutes', 'Quadriceps', 'Calves', 'Hamstrings'],
    equipment: 'Staircase / Revolving Stair Machine',
    description: 'Ascending stairs continuously with upright posture and full foot placement.',
    caloriesPerMin70kg: 11.0,
    benefits: 'Superb glute and quad shaping, burns twice as many calories as flat walking.',
    youtubeUrl: 'https://www.youtube.com/watch?v=F0kQvK4X0aA',
    youtubeVideoId: 'F0kQvK4X0aA'
  },
  {
    id: 'ex-cardio-11',
    name: 'Elliptical Cross Trainer',
    category: 'cardio',
    met: 6.5,
    intensity: 'moderate',
    targetMuscles: ['Quadriceps', 'Glutes', 'Chest', 'Back'],
    equipment: 'Elliptical Machine',
    description: 'Dual-action pedal gliding with synchronized push-pull handlebar movement.',
    caloriesPerMin70kg: 8.0,
    benefits: 'Smooth, non-jarring low impact cardio suitable for rehabilitation and active recovery.',
    youtubeUrl: 'https://www.youtube.com/watch?v=A8vG4uQ9w4w',
    youtubeVideoId: 'A8vG4uQ9w4w'
  },
  {
    id: 'ex-cardio-12',
    name: 'Zumba & Aerobics Dance',
    category: 'cardio',
    met: 6.8,
    intensity: 'moderate',
    targetMuscles: ['Whole Body', 'Hips', 'Core', 'Calves'],
    equipment: 'None / Music',
    description: 'High-energy, music-driven rhythmic dance movements and choreographed steps.',
    caloriesPerMin70kg: 8.3,
    benefits: 'Elevates mood and serotonin, improves coordination, high social enjoyment.',
    youtubeUrl: 'https://www.youtube.com/watch?v=8DZktowZo_k',
    youtubeVideoId: '8DZktowZo_k'
  },

  // ==========================================
  // STRENGTH & GYM (RESISTANCE TRAINING)
  // ==========================================
  {
    id: 'ex-str-1',
    name: 'Barbell Back Squat',
    category: 'strength',
    met: 6.0,
    intensity: 'high',
    targetMuscles: ['Quadriceps', 'Glutes', 'Hamstrings', 'Lower Back', 'Core'],
    equipment: 'Barbell, Squat Rack, Weight Plates',
    description: 'The king of lower-body lifts. Lowering hips until thighs are parallel with floor, then driving through heels.',
    caloriesPerMin70kg: 7.4,
    benefits: 'Stimulates systemic muscle growth, reinforces bone mineral density and hip strength.',
    youtubeUrl: 'https://www.youtube.com/watch?v=bEv6CCg2BC8',
    youtubeVideoId: 'bEv6CCg2BC8'
  },
  {
    id: 'ex-str-2',
    name: 'Deadlift (Conventional / Sumo)',
    category: 'strength',
    met: 6.5,
    intensity: 'vigorous',
    targetMuscles: ['Hamstrings', 'Glutes', 'Erector Spinae', 'Lats', 'Forearms', 'Traps'],
    equipment: 'Barbell, Weight Plates',
    description: 'Lifting loaded barbell from floor to hip lockout using powerful posterior chain extension.',
    caloriesPerMin70kg: 8.0,
    benefits: 'Builds functional pulling power, prevents lower back injury, strengthens posture.',
    youtubeUrl: 'https://www.youtube.com/watch?v=VL5Ab0T07e4',
    youtubeVideoId: 'VL5Ab0T07e4'
  },
  {
    id: 'ex-str-3',
    name: 'Barbell Flat Bench Press',
    category: 'strength',
    met: 5.5,
    intensity: 'moderate',
    targetMuscles: ['Pectoralis Major', 'Anterior Deltoids', 'Triceps Brachii'],
    equipment: 'Bench, Barbell, Weight Plates',
    description: 'Pressing barbell upward from mid-chest level with elbows tucked at roughly 45 degrees.',
    caloriesPerMin70kg: 6.7,
    benefits: 'Foundational upper-body pushing power, develops thick chest and front shoulders.',
    youtubeUrl: 'https://www.youtube.com/watch?v=4Y2ZdHCOXok',
    youtubeVideoId: '4Y2ZdHCOXok'
  },
  {
    id: 'ex-str-4',
    name: 'Incline Dumbbell Chest Press',
    category: 'strength',
    met: 5.5,
    intensity: 'moderate',
    targetMuscles: ['Clavicular Chest (Upper Pectorals)', 'Shoulders', 'Triceps'],
    equipment: 'Incline Bench, Pair of Dumbbells',
    description: 'Pressing dumbbells on 30-degree incline to target upper clavicular chest fibers.',
    caloriesPerMin70kg: 6.7,
    benefits: 'Fixes left-right muscular imbalances, isolates upper chest development.',
    youtubeUrl: 'https://www.youtube.com/watch?v=8iPEnn-ltC8',
    youtubeVideoId: '8iPEnn-ltC8'
  },
  {
    id: 'ex-str-5',
    name: 'Overhead Barbell Shoulder Press (OHP)',
    category: 'strength',
    met: 5.8,
    intensity: 'high',
    targetMuscles: ['Deltoids (Shoulders)', 'Upper Trapezius', 'Triceps', 'Core'],
    equipment: 'Barbell / Dumbbells',
    description: 'Pressing bar directly overhead while maintaining tight glutes and braced core.',
    caloriesPerMin70kg: 7.1,
    benefits: 'Builds boulder shoulders and resilient rotator cuffs with standing core stabilization.',
    youtubeUrl: 'https://www.youtube.com/watch?v=2yjwXTZQDDI',
    youtubeVideoId: '2yjwXTZQDDI'
  },
  {
    id: 'ex-str-6',
    name: 'Bent-Over Barbell Row',
    category: 'strength',
    met: 5.8,
    intensity: 'moderate',
    targetMuscles: ['Latissimus Dorsi', 'Rhomboids', 'Rear Delts', 'Biceps', 'Lower Back'],
    equipment: 'Barbell, Weight Plates',
    description: 'Hinged forward at 45 degrees, pulling bar towards lower rib cage with scapular retraction.',
    caloriesPerMin70kg: 7.1,
    benefits: 'Essential for upper back thickness and counteracting forward slouching posture.',
    youtubeUrl: 'https://www.youtube.com/watch?v=FWJR5Ve8gkQ',
    youtubeVideoId: 'FWJR5Ve8gkQ'
  },
  {
    id: 'ex-str-7',
    name: 'Lat Pulldown (Wide & Close Grip)',
    category: 'strength',
    met: 5.0,
    intensity: 'moderate',
    targetMuscles: ['Latissimus Dorsi (Lats)', 'Biceps', 'Teres Major'],
    equipment: 'Cable Lat Machine',
    description: 'Smoothly drawing cable bar down to upper clavicle while arching chest upward.',
    caloriesPerMin70kg: 6.1,
    benefits: 'Creates V-taper physique, scalable resistance for building pull-up strength.',
    youtubeUrl: 'https://www.youtube.com/watch?v=CAwf7n6Luuc',
    youtubeVideoId: 'CAwf7n6Luuc'
  },
  {
    id: 'ex-str-8',
    name: 'Leg Press (Machine 45-degree)',
    category: 'strength',
    met: 5.5,
    intensity: 'moderate',
    targetMuscles: ['Quadriceps', 'Glutes', 'Hamstrings'],
    equipment: '45° Incline Leg Press',
    description: 'Controlled pressing of sled platform without locking out knees at the peak.',
    caloriesPerMin70kg: 6.7,
    benefits: 'Heavy leg overload with minimal lower spinal loading.',
    youtubeUrl: 'https://www.youtube.com/watch?v=IZxyjW7MPJQ',
    youtubeVideoId: 'IZxyjW7MPJQ'
  },
  {
    id: 'ex-str-9',
    name: 'Romanian Deadlift (RDL with Dumbbells)',
    category: 'strength',
    met: 5.5,
    intensity: 'moderate',
    targetMuscles: ['Hamstrings', 'Gluteus Maximus', 'Erector Spinae'],
    equipment: 'Dumbbells / Barbell',
    description: 'Hip hinge movement with soft knees, pushing hips back until deep hamstring stretch.',
    caloriesPerMin70kg: 6.7,
    benefits: 'Unbeatable hamstring hypertrophy and knee stability reinforcement.',
    youtubeUrl: 'https://www.youtube.com/watch?v=JCXUYuzwNrM',
    youtubeVideoId: 'JCXUYuzwNrM'
  },
  {
    id: 'ex-str-10',
    name: 'Bicep Barbell & Dumbbell Curls',
    category: 'strength',
    met: 4.5,
    intensity: 'moderate',
    targetMuscles: ['Biceps Brachii', 'Brachialis', 'Forearms'],
    equipment: 'Barbell / Dumbbells',
    description: 'Isolated elbow flexion without using body momentum or swinging lower back.',
    caloriesPerMin70kg: 5.5,
    benefits: 'Direct arm growth, increases grip and carrying power.',
    youtubeUrl: 'https://www.youtube.com/watch?v=ykJmrZ5v0Oo',
    youtubeVideoId: 'ykJmrZ5v0Oo'
  },
  {
    id: 'ex-str-11',
    name: 'Tricep Rope Pushdowns & Skullcrushers',
    category: 'strength',
    met: 4.5,
    intensity: 'moderate',
    targetMuscles: ['Triceps (Lateral, Medial, Long Head)'],
    equipment: 'Cable Machine / EZ-Curl Bar',
    description: 'Elbow extension targeting the tricep muscle that comprises 60% of upper arm size.',
    caloriesPerMin70kg: 5.5,
    benefits: 'Reinforces elbow joints and lock-out pushing strength.',
    youtubeUrl: 'https://www.youtube.com/watch?v=vB5OHsJ3EME',
    youtubeVideoId: 'vB5OHsJ3EME'
  },
  {
    id: 'ex-str-12',
    name: 'Kettlebell Swings (Russian & American)',
    category: 'strength',
    met: 8.5,
    intensity: 'high',
    targetMuscles: ['Glutes', 'Hamstrings', 'Lower Back', 'Shoulders', 'Core'],
    equipment: 'Kettlebell',
    description: 'Explosive hip hinge thrusting kettlebell to chest height using glute power.',
    caloriesPerMin70kg: 10.4,
    benefits: 'Combines dynamic cardiovascular conditioning with bulletproof posterior chain power.',
    youtubeUrl: 'https://www.youtube.com/watch?v=YSxHifyI6s8',
    youtubeVideoId: 'YSxHifyI6s8'
  },

  // ==========================================
  // CALISTHENICS & BODYWEIGHT
  // ==========================================
  {
    id: 'ex-cal-1',
    name: 'Standard Push-Ups (Strict Form)',
    category: 'calisthenics',
    met: 5.0,
    intensity: 'moderate',
    targetMuscles: ['Chest', 'Anterior Deltoids', 'Triceps', 'Core'],
    equipment: 'None (Bodyweight)',
    description: 'Plank position lowering chest to floor and pushing up with locked core and glutes.',
    caloriesPerMin70kg: 6.1,
    benefits: 'Ultimate bodyweight push mastery, zero equipment needed anywhere.',
    youtubeUrl: 'https://www.youtube.com/watch?v=IODxDxX7oi4',
    youtubeVideoId: 'IODxDxX7oi4'
  },
  {
    id: 'ex-cal-2',
    name: 'Diamond / Close-Grip Push-Ups',
    category: 'calisthenics',
    met: 5.5,
    intensity: 'high',
    targetMuscles: ['Triceps', 'Inner Pectorals', 'Shoulders'],
    equipment: 'None (Bodyweight)',
    description: 'Hands together forming a triangle/diamond below chest for intense tricep loading.',
    caloriesPerMin70kg: 6.7,
    benefits: 'High arm isolation without weights.',
    youtubeUrl: 'https://www.youtube.com/watch?v=J0DnG1_S92I',
    youtubeVideoId: 'J0DnG1_S92I'
  },
  {
    id: 'ex-cal-3',
    name: 'Strict Pull-Ups / Chin-Ups',
    category: 'calisthenics',
    met: 7.0,
    intensity: 'vigorous',
    targetMuscles: ['Lats', 'Biceps', 'Rhomboids', 'Forearms', 'Core'],
    equipment: 'Pull-Up Bar',
    description: 'Dead hang pulling chin above bar without kipping or swinging legs.',
    caloriesPerMin70kg: 8.6,
    benefits: 'Gold standard measure of relative upper-body strength.',
    youtubeUrl: 'https://www.youtube.com/watch?v=eGo4IYlbE5g',
    youtubeVideoId: 'eGo4IYlbE5g'
  },
  {
    id: 'ex-cal-4',
    name: 'Parallel Bar Dips',
    category: 'calisthenics',
    met: 6.5,
    intensity: 'high',
    targetMuscles: ['Lower Chest', 'Triceps', 'Front Deltoids'],
    equipment: 'Dip Station / Parallel Bars',
    description: 'Lowering torso until elbows form 90 degrees, then pressing up forcefully.',
    caloriesPerMin70kg: 8.0,
    benefits: 'Massive compound pressing power for upper torso.',
    youtubeUrl: 'https://www.youtube.com/watch?v=2z8JmcrW-As',
    youtubeVideoId: '2z8JmcrW-As'
  },
  {
    id: 'ex-cal-5',
    name: 'Air Squats & Jump Squats',
    category: 'calisthenics',
    met: 6.0,
    intensity: 'moderate',
    targetMuscles: ['Quadriceps', 'Glutes', 'Calves', 'Core'],
    equipment: 'None (Bodyweight)',
    description: 'Deep bodyweight squats with optional explosive vertical jumps at top.',
    caloriesPerMin70kg: 7.4,
    benefits: 'Lower body stamina, knee cartilage lubrication, high metabolic rate.',
    youtubeUrl: 'https://www.youtube.com/watch?v=C_VtOYc6j5c',
    youtubeVideoId: 'C_VtOYc6j5c'
  },
  {
    id: 'ex-cal-6',
    name: 'Walking Lunges / Reverse Lunges',
    category: 'calisthenics',
    met: 5.5,
    intensity: 'moderate',
    targetMuscles: ['Glutes', 'Quadriceps', 'Hamstrings', 'Adductors'],
    equipment: 'None',
    description: 'Step-by-step deep lunges dropping rear knee gently above ground.',
    caloriesPerMin70kg: 6.7,
    benefits: 'Unilateral balance, fixes leg symmetry and hip mobility.',
    youtubeUrl: 'https://www.youtube.com/watch?v=L8fvypPrzzs',
    youtubeVideoId: 'L8fvypPrzzs'
  },
  {
    id: 'ex-cal-7',
    name: 'Isometric Forearm Plank Hold',
    category: 'calisthenics',
    met: 4.0,
    intensity: 'moderate',
    targetMuscles: ['Transverse Abdominis', 'Obliques', 'Shoulders', 'Lower Back'],
    equipment: 'Exercise Mat',
    description: 'Rigid horizontal bridge resting on forearms and toes with zero spinal sagging.',
    caloriesPerMin70kg: 4.9,
    benefits: 'Prevents lower back pain, builds rock-solid deep abdominal wall.',
    youtubeUrl: 'https://www.youtube.com/watch?v=pSHjTRCQxIw',
    youtubeVideoId: 'pSHjTRCQxIw'
  },
  {
    id: 'ex-cal-8',
    name: 'Hanging Leg Raises / Knee Tucks',
    category: 'calisthenics',
    met: 5.5,
    intensity: 'high',
    targetMuscles: ['Lower Rectus Abdominis', 'Hip Flexors', 'Grip'],
    equipment: 'Pull-Up Bar',
    description: 'Hanging from bar and raising straight legs to 90 degrees with posterior pelvic tilt.',
    caloriesPerMin70kg: 6.7,
    benefits: 'Targets lower abdominal fibers and grip stamina.',
    youtubeUrl: 'https://www.youtube.com/watch?v=Pr1ieGZ5atk',
    youtubeVideoId: 'Pr1ieGZ5atk'
  },
  {
    id: 'ex-cal-9',
    name: 'Burpees with Push-Up & Jump',
    category: 'calisthenics',
    met: 10.0,
    intensity: 'vigorous',
    targetMuscles: ['Whole Body', 'Chest', 'Quads', 'Core', 'Shoulders'],
    equipment: 'None',
    description: 'Squat thrust into full push-up, snapping feet back in and leaping with arms overhead.',
    caloriesPerMin70kg: 12.3,
    benefits: 'Full-body cardiovascular inferno, maximal metabolic conditioning.',
    youtubeUrl: 'https://www.youtube.com/watch?v=dZgVxmf6jkA',
    youtubeVideoId: 'dZgVxmf6jkA'
  },
  {
    id: 'ex-cal-10',
    name: 'Mountain Climbers',
    category: 'calisthenics',
    met: 8.0,
    intensity: 'high',
    targetMuscles: ['Core', 'Shoulders', 'Hip Flexors', 'Quadriceps'],
    equipment: 'Mat',
    description: 'High plank running knee drives towards chest in rapid alternating succession.',
    caloriesPerMin70kg: 9.8,
    benefits: 'Dynamic core burning with cardiovascular endurance.',
    youtubeUrl: 'https://www.youtube.com/watch?v=nmwgirgXLYM',
    youtubeVideoId: 'nmwgirgXLYM'
  },

  // ==========================================
  // YOGA, ASANAS & FLEXIBILITY
  // ==========================================
  {
    id: 'ex-yoga-1',
    name: 'Surya Namaskar (Sun Salutation - 12 Cycles)',
    category: 'yoga',
    met: 6.5,
    intensity: 'moderate',
    targetMuscles: ['Full Body', 'Spine', 'Hamstrings', 'Chest', 'Core'],
    equipment: 'Yoga Mat',
    description: 'Ancient sequence of 12 linked postures synchronized with rhythmic inhalation and exhalation.',
    caloriesPerMin70kg: 8.0,
    benefits: 'Complete mind-body integration, enhances flexibility, boosts blood circulation.',
    youtubeUrl: 'https://www.youtube.com/watch?v=6IUxyDDsmWc',
    youtubeVideoId: '6IUxyDDsmWc'
  },
  {
    id: 'ex-yoga-2',
    name: 'Hatha Yoga Flow & Deep Asanas',
    category: 'yoga',
    met: 3.5,
    intensity: 'low',
    targetMuscles: ['Full Body Mobility', 'Hip Openers', 'Spine Extensors'],
    equipment: 'Yoga Mat',
    description: 'Slow-paced posture holds focusing on alignment, relaxation, and steady breathing.',
    caloriesPerMin70kg: 4.3,
    benefits: 'Reduces cortisol stress hormone, increases joint synovial fluid flow.',
    youtubeUrl: 'https://www.youtube.com/watch?v=v7AYKMP6rOE',
    youtubeVideoId: 'v7AYKMP6rOE'
  },
  {
    id: 'ex-yoga-3',
    name: 'Vinyasa Power Flow Yoga',
    category: 'yoga',
    met: 5.5,
    intensity: 'moderate',
    targetMuscles: ['Shoulders', 'Core', 'Legs', 'Glutes'],
    equipment: 'Yoga Mat',
    description: 'Fluid continuous transitions between warrior poses, chaturanga, and balance holds.',
    caloriesPerMin70kg: 6.7,
    benefits: 'Builds lean functional muscle tone and cardiovascular stamina.',
    youtubeUrl: 'https://www.youtube.com/watch?v=b1H3xO3x_Js',
    youtubeVideoId: 'b1H3xO3x_Js'
  },
  {
    id: 'ex-yoga-4',
    name: 'Pranayama (Kapalabhati, Anulom Vilom, Bhastrika)',
    category: 'yoga',
    met: 2.2,
    intensity: 'low',
    targetMuscles: ['Diaphragm', 'Intercostal Respiratory Muscles'],
    equipment: 'Quiet Space, Mat',
    description: 'Controlled yogic breathwork techniques purifying the nervous system and oxygenating cells.',
    caloriesPerMin70kg: 2.7,
    benefits: 'Calms anxiety, lowers resting pulse rate, clears mental fog.',
    youtubeUrl: 'https://www.youtube.com/watch?v=aOl_w4nB3hY',
    youtubeVideoId: 'aOl_w4nB3hY'
  },
  {
    id: 'ex-yoga-5',
    name: 'Warrior Poses Series (Virabhadrasana I, II, III)',
    category: 'yoga',
    met: 4.0,
    intensity: 'moderate',
    targetMuscles: ['Quadriceps', 'Glutes', 'Ankles', 'Shoulders', 'Balance'],
    equipment: 'Yoga Mat',
    description: 'Grounding lunging poses expanding chest with focus and single-leg balancing.',
    caloriesPerMin70kg: 4.9,
    benefits: 'Strengthens ankles, knees, pelvic floor, and mental determination.',
    youtubeUrl: 'https://www.youtube.com/watch?v=5rj_j4wW1K8',
    youtubeVideoId: '5rj_j4wW1K8'
  },
  {
    id: 'ex-yoga-6',
    name: 'Mat Pilates Core Sculpting',
    category: 'yoga',
    met: 4.5,
    intensity: 'moderate',
    targetMuscles: ['Deep Core (Transverse)', 'Glutes', 'Inner Thighs', 'Postural Chain'],
    equipment: 'Pilates Mat',
    description: 'Controlled low-impact movements focusing on core powerhouse stability and spine lengthening.',
    caloriesPerMin70kg: 5.5,
    benefits: 'Realigns posture, tightens waistline, cures muscular imbalances.',
    youtubeUrl: 'https://www.youtube.com/watch?v=K-PpDfxpQhU',
    youtubeVideoId: 'K-PpDfxpQhU'
  },

  // ==========================================
  // WORLDWIDE SPORTS & ATHLETICS
  // ==========================================
  {
    id: 'ex-sport-1',
    name: 'Cricket (Batting, Fast Bowling & Fielding)',
    category: 'sports',
    met: 6.5,
    intensity: 'moderate',
    targetMuscles: ['Shoulders', 'Legs (Running between wickets)', 'Core', 'Forearms'],
    equipment: 'Cricket Bat, Ball, Gear',
    description: 'Dynamic team sport featuring sprint intervals between wickets, bowling run-ups, and fielding agility.',
    caloriesPerMin70kg: 8.0,
    benefits: 'Hand-eye coordination, rapid acceleration, teamwork and strategic sharpness.',
    youtubeUrl: 'https://www.youtube.com/watch?v=8Vz1F2s94tE',
    youtubeVideoId: '8Vz1F2s94tE'
  },
  {
    id: 'ex-sport-2',
    name: 'Football / Soccer (Competitive Match)',
    category: 'sports',
    met: 10.0,
    intensity: 'vigorous',
    targetMuscles: ['Quadriceps', 'Hamstrings', 'Calves', 'Cardiovascular System', 'Core'],
    equipment: 'Football, Cleats',
    description: 'Continuous 90-minute pitch running, directional change sprints, ball kicking and jumping.',
    caloriesPerMin70kg: 12.3,
    benefits: 'Phenomenal aerobic and anaerobic capacity, lower-body athletic agility.',
    youtubeUrl: 'https://www.youtube.com/watch?v=Z4rN8Y8n2W8',
    youtubeVideoId: 'Z4rN8Y8n2W8'
  },
  {
    id: 'ex-sport-3',
    name: 'Badminton (Singles / Doubles Match)',
    category: 'sports',
    met: 7.5,
    intensity: 'high',
    targetMuscles: ['Calves', 'Shoulder / Rotator Cuff', 'Forearms', 'Glutes'],
    equipment: 'Racket, Shuttlecock, Court',
    description: 'Fast-paced court movement, explosive smashes, drop shots, and rapid directional lunges.',
    caloriesPerMin70kg: 9.2,
    benefits: 'Reflex reaction time, burns massive calories in short timeframes.',
    youtubeUrl: 'https://www.youtube.com/watch?v=1UihezO6Dq4',
    youtubeVideoId: '1UihezO6Dq4'
  },
  {
    id: 'ex-sport-4',
    name: 'Tennis (Singles Tournament Match)',
    category: 'sports',
    met: 8.0,
    intensity: 'high',
    targetMuscles: ['Forehand/Backhand Arms', 'Shoulders', 'Legs', 'Core Obliques'],
    equipment: 'Tennis Racket, Tennis Balls, Court',
    description: 'High-intensity court sprints, powerful groundstrokes, serves, and stamina rallies.',
    caloriesPerMin70kg: 9.8,
    benefits: 'Total-body cardiovascular conditioning and explosive rotational power.',
    youtubeUrl: 'https://www.youtube.com/watch?v=YqgcykDGB2A',
    youtubeVideoId: 'YqgcykDGB2A'
  },
  {
    id: 'ex-sport-5',
    name: 'Basketball (Full-Court Game)',
    category: 'sports',
    met: 8.5,
    intensity: 'high',
    targetMuscles: ['Legs', 'Calves (Vertical Jump)', 'Deltoids', 'Cardio'],
    equipment: 'Basketball, Hoop',
    description: 'Fast break sprints, vertical rebounding, defensive sliding, and shooting accuracy.',
    caloriesPerMin70kg: 10.4,
    benefits: 'Vertical jump power, anaerobic conditioning, spatial awareness.',
    youtubeUrl: 'https://www.youtube.com/watch?v=3wWc8L5vG64',
    youtubeVideoId: '3wWc8L5vG64'
  },
  {
    id: 'ex-sport-6',
    name: 'Kabaddi (Raiding & Defensive Tackling)',
    category: 'sports',
    met: 9.0,
    intensity: 'vigorous',
    targetMuscles: ['Legs', 'Back', 'Shoulders', 'Grip', 'Core', 'Lungs'],
    equipment: 'Court / Mat',
    description: 'Traditional contact sport requiring sustained breath retention (cant), rapid dodging, and powerful grappling.',
    caloriesPerMin70kg: 11.0,
    benefits: 'Lung capacity endurance, raw grappling strength, high agility under pressure.',
    youtubeUrl: 'https://www.youtube.com/watch?v=zR0lZqG_g1o',
    youtubeVideoId: 'zR0lZqG_g1o'
  },
  {
    id: 'ex-sport-7',
    name: 'Volleyball (Beach or Indoor Court)',
    category: 'sports',
    met: 6.0,
    intensity: 'moderate',
    targetMuscles: ['Shoulders', 'Quadriceps', 'Calves', 'Core'],
    equipment: 'Volleyball, Net',
    description: 'Spiking, blocking, diving digs, and setting with continuous lateral footwork.',
    caloriesPerMin70kg: 7.4,
    benefits: 'Upper-body plyometrics, team communication, lower limb reactive spring.',
    youtubeUrl: 'https://www.youtube.com/watch?v=bV1Fz4W_r8k',
    youtubeVideoId: 'bV1Fz4W_r8k'
  },
  {
    id: 'ex-sport-8',
    name: 'Table Tennis / Ping Pong',
    category: 'sports',
    met: 4.2,
    intensity: 'moderate',
    targetMuscles: ['Forearms', 'Wrists', 'Calves', 'Quads'],
    equipment: 'Paddles, Ball, Table',
    description: 'Fast-paced wrist spins, quick side shuffles, and high-frequency reflex exchanges.',
    caloriesPerMin70kg: 5.2,
    benefits: 'Sharpens brain neuroplasticity, hand-eye coordination, low joint strain.',
    youtubeUrl: 'https://www.youtube.com/watch?v=kYJzX3NlC48',
    youtubeVideoId: 'kYJzX3NlC48'
  },
  {
    id: 'ex-sport-9',
    name: 'Boxing (Heavy Bag & Sparring)',
    category: 'sports',
    met: 9.5,
    intensity: 'vigorous',
    targetMuscles: ['Shoulders', 'Chest', 'Core', 'Hips', 'Calves'],
    equipment: 'Boxing Gloves, Heavy Bag',
    description: 'Rhythmic combinations of jabs, crosses, hooks, slips, and continuous footwork.',
    caloriesPerMin70kg: 11.7,
    benefits: 'Stress release, rotational power transfer, intense cardiovascular stamina.',
    youtubeUrl: 'https://www.youtube.com/watch?v=2T8gP_R21rI',
    youtubeVideoId: '2T8gP_R21rI'
  },
  {
    id: 'ex-sport-10',
    name: 'Martial Arts & MMA (Karate / Taekwondo / Judo)',
    category: 'sports',
    met: 10.0,
    intensity: 'vigorous',
    targetMuscles: ['Whole Body', 'Hip Flexors', 'Core', 'Shoulders'],
    equipment: 'Gi / Gloves / Mats',
    description: 'Striking, kicking techniques, throws, and ground grappling defense drills.',
    caloriesPerMin70kg: 12.3,
    benefits: 'Self-defense capability, flexibility, mental discipline, and resilience.',
    youtubeUrl: 'https://www.youtube.com/watch?v=wX0kGg_bNlc',
    youtubeVideoId: 'wX0kGg_bNlc'
  },

  // ==========================================
  // TRADITIONAL & DESI WORKOUTS
  // ==========================================
  {
    id: 'ex-trad-1',
    name: 'Desi Akhada Dand-Baithak (Hindu Pushups & Deep Squats)',
    category: 'traditional',
    met: 8.0,
    intensity: 'high',
    targetMuscles: ['Chest', 'Shoulders', 'Spine Mobility', 'Quadriceps', 'Core'],
    equipment: 'Ground / Soil',
    description: 'Traditional Indian wrestling calisthenics: diving swooping pushups (Dand) and heel-elevated deep squats (Baithak).',
    caloriesPerMin70kg: 9.8,
    benefits: 'Incredible spinal flexibility, bulletproof joints, raw natural tendon strength.',
    youtubeUrl: 'https://www.youtube.com/watch?v=k3C3k1V0n28',
    youtubeVideoId: 'k3C3k1V0n28'
  },
  {
    id: 'ex-trad-2',
    name: 'Garba & Dandiya Raas Folk Dance',
    category: 'traditional',
    met: 7.2,
    intensity: 'high',
    targetMuscles: ['Calves', 'Quadriceps', 'Core', 'Shoulders', 'Cardio'],
    equipment: 'Dandiya Sticks / Music',
    description: 'High-energy circular folk dance with rhythmic clapping, twirling, and jumping to dhol beats.',
    caloriesPerMin70kg: 8.8,
    benefits: 'Burns thousands of calories during festivities, massive endorphin boost.',
    youtubeUrl: 'https://www.youtube.com/watch?v=t8O_j2X1f9Q',
    youtubeVideoId: 't8O_j2X1f9Q'
  },
  {
    id: 'ex-trad-3',
    name: 'Bhangra High-Intensity Dance Workout',
    category: 'traditional',
    met: 8.5,
    intensity: 'high',
    targetMuscles: ['Whole Body', 'Legs', 'Shoulders', 'Heart'],
    equipment: 'High-Tempo Music',
    description: 'Explosive Punjabi folk dance steps with shoulder bounces, high kicks, and joyous jumps.',
    caloriesPerMin70kg: 10.4,
    benefits: 'Intense fat burning workout that feels like an energetic cultural celebration.',
    youtubeUrl: 'https://www.youtube.com/watch?v=a3z3RsmpeIo',
    youtubeVideoId: 'a3z3RsmpeIo'
  },
  {
    id: 'ex-trad-4',
    name: 'Mallakhamb (Pole Gymnastics & Balance)',
    category: 'traditional',
    met: 7.5,
    intensity: 'vigorous',
    targetMuscles: ['Grip', 'Lats', 'Core', 'Inner Thighs', 'Shoulders'],
    equipment: 'Wooden Mallakhamb Pole / Rope',
    description: 'Ancient Indian gymnastic discipline holding aerial postures and acrobatic grips on a wooden pole.',
    caloriesPerMin70kg: 9.2,
    benefits: 'Exceptional grip strength, 360-degree core mastery, neuromuscular control.',
    youtubeUrl: 'https://www.youtube.com/watch?v=jW_nK6jYq2U',
    youtubeVideoId: 'jW_nK6jYq2U'
  },
  {
    id: 'ex-trad-5',
    name: 'Mudgar / Gada Swinging (Indian Club)',
    category: 'traditional',
    met: 6.5,
    intensity: 'moderate',
    targetMuscles: ['Shoulders (Rotator Cuff)', 'Forearms', 'Upper Back', 'Core'],
    equipment: 'Wooden Gada / Mudgar',
    description: 'Fluid 360-degree pendulum swings around the head and shoulders with heavy weighted club.',
    caloriesPerMin70kg: 8.0,
    benefits: 'Prevents shoulder impingement, reinforces wrist and forearm grip density.',
    youtubeUrl: 'https://www.youtube.com/watch?v=9jX2YmG5m10',
    youtubeVideoId: '9jX2YmG5m10'
  },

  // ==========================================
  // HIIT & CONDITIONING
  // ==========================================
  {
    id: 'ex-trad-6',
    name: 'HIIT Tabata Intervals (20s Work / 10s Rest)',
    category: 'hiit',
    met: 11.5,
    intensity: 'vigorous',
    targetMuscles: ['Total Body', 'Heart', 'Lungs', 'Fast-Twitch Fibers'],
    equipment: 'Timer / Mat',
    description: '8 rounds of 20 seconds maximum output followed by 10 seconds rest.',
    caloriesPerMin70kg: 14.1,
    benefits: 'Triggers long-lasting EPOC caloric burn up to 24 hours post-workout.',
    youtubeUrl: 'https://www.youtube.com/watch?v=ml6cT4AZdqI',
    youtubeVideoId: 'ml6cT4AZdqI'
  },
  {
    id: 'ex-trad-7',
    name: 'Farmer’s Walk (Heavy Load Carry)',
    category: 'hiit',
    met: 7.5,
    intensity: 'high',
    targetMuscles: ['Traps', 'Forearms/Grip', 'Core/Obliques', 'Glutes'],
    equipment: 'Heavy Dumbbells / Kettlebells',
    description: 'Walking erect with heavy weights in each hand for time or distance without leaning.',
    caloriesPerMin70kg: 9.2,
    benefits: 'Real-world functional strength, creates unbreakable core and grip power.',
    youtubeUrl: 'https://www.youtube.com/watch?v=Fkzk_RqlYig',
    youtubeVideoId: 'Fkzk_RqlYig'
  },

  // ==========================================
  // DAILY LIFE & FUNCTIONAL
  // ==========================================
  {
    id: 'ex-trad-8',
    name: 'Daily Housework (Mopping, Scrubbing & Deep Cleaning)',
    category: 'daily_life',
    met: 3.8,
    intensity: 'moderate',
    targetMuscles: ['Arms', 'Shoulders', 'Lower Back', 'Legs'],
    equipment: 'Mop, Bucket, Cleaning Cloth',
    description: 'Vigorous floor scrubbing, surface cleaning, and moving items around home.',
    caloriesPerMin70kg: 4.7,
    benefits: 'NEAT (Non-Exercise Activity Thermogenesis) boosting daily calorie expenditure.',
    youtubeUrl: 'https://www.youtube.com/watch?v=2n3c7Jb2m5E',
    youtubeVideoId: '2n3c7Jb2m5E'
  },
  {
    id: 'ex-trad-9',
    name: 'Gardening & Yard Work (Digging & Planting)',
    category: 'daily_life',
    met: 4.5,
    intensity: 'moderate',
    targetMuscles: ['Forearms', 'Lower Back', 'Quadriceps', 'Core'],
    equipment: 'Spade, Trowel, Watering Can',
    description: 'Digging soil, pulling weeds, lifting pots, and pruning plants outdoors in sunlight.',
    caloriesPerMin70kg: 5.5,
    benefits: 'Natural Vitamin D exposure, relaxing mindfulness, sustained gentle movement.',
    youtubeUrl: 'https://www.youtube.com/watch?v=wz6sU6V-v60',
    youtubeVideoId: 'wz6sU6V-v60'
  },
  {
    id: 'ex-trad-10',
    name: 'Carrying Heavy Groceries up Stairs',
    category: 'daily_life',
    met: 7.0,
    intensity: 'high',
    targetMuscles: ['Biceps', 'Traps', 'Glutes', 'Calves', 'Quadriceps'],
    equipment: 'Grocery Bags',
    description: 'Climbing multiple flights of building stairs carrying heavy shopping bags.',
    caloriesPerMin70kg: 8.6,
    benefits: 'Everyday functional conditioning that replaces elevator rides with health gains.',
    youtubeUrl: 'https://www.youtube.com/watch?v=kY0iK1f0Vq8',
    youtubeVideoId: 'kY0iK1f0Vq8'
  }
];

export const EXERCISE_CATEGORIES: Array<{ id: ExerciseCategory; name: string; iconName: string; color: string; bg: string }> = [
  { id: 'cardio', name: 'Cardio & Running', iconName: 'Flame', color: 'text-amber-500 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-950/40' },
  { id: 'strength', name: 'Strength & Gym', iconName: 'Dumbbell', color: 'text-rose-500 dark:text-rose-400', bg: 'bg-rose-50 dark:bg-rose-950/40' },
  { id: 'calisthenics', name: 'Calisthenics & Bodyweight', iconName: 'Activity', color: 'text-emerald-500 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-950/40' },
  { id: 'yoga', name: 'Yoga & Flexibility', iconName: 'Sparkles', color: 'text-purple-500 dark:text-purple-400', bg: 'bg-purple-50 dark:bg-purple-950/40' },
  { id: 'sports', name: 'Worldwide Sports', iconName: 'Trophy', color: 'text-sky-500 dark:text-sky-400', bg: 'bg-sky-50 dark:bg-sky-950/40' },
  { id: 'traditional', name: 'Traditional & Desi Workouts', iconName: 'Shield', color: 'text-orange-500 dark:text-orange-400', bg: 'bg-orange-50 dark:bg-orange-950/40' },
  { id: 'hiit', name: 'HIIT & Conditioning', iconName: 'Zap', color: 'text-red-500 dark:text-red-400', bg: 'bg-red-50 dark:bg-red-950/40' },
  { id: 'daily_life', name: 'Daily Life & Functional', iconName: 'Heart', color: 'text-teal-500 dark:text-teal-400', bg: 'bg-teal-50 dark:bg-teal-950/40' }
];

export function calculateCaloriesBurned(met: number, weightKg: number = 70, durationMinutes: number): number {
  // Calorie formula: (MET * 3.5 * weightInKg / 200) * durationMinutes
  const safeWeight = weightKg > 20 ? weightKg : 70;
  const cals = (met * 3.5 * safeWeight / 200) * durationMinutes;
  return Math.round(cals);
}

export function extractYoutubeId(youtubeUrlOrId?: string): string {
  if (!youtubeUrlOrId) return '';
  const clean = youtubeUrlOrId.trim();
  const match = clean.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
  if (match && match[1]) {
    return match[1];
  }
  if (clean.length === 11 && !clean.includes('/') && !clean.includes('?')) {
    return clean;
  }
  return '';
}

export function getYoutubeEmbedUrl(youtubeUrlOrId?: string): string {
  const videoId = extractYoutubeId(youtubeUrlOrId);
  if (!videoId) return '';
  // youtube-nocookie.com provides the best cross-origin and sandbox iframe compatibility
  return `https://www.youtube-nocookie.com/embed/${videoId}?rel=0&modestbranding=1&playsinline=1&enablejsapi=1`;
}

export function getYoutubeDirectUrl(youtubeUrlOrId?: string, fallbackQuery?: string): string {
  const videoId = extractYoutubeId(youtubeUrlOrId);
  if (videoId) {
    return `https://www.youtube.com/watch?v=${videoId}`;
  }
  if (youtubeUrlOrId && (youtubeUrlOrId.startsWith('http://') || youtubeUrlOrId.startsWith('https://'))) {
    return youtubeUrlOrId;
  }
  if (fallbackQuery) {
    return `https://www.youtube.com/results?search_query=${encodeURIComponent(fallbackQuery + ' exercise tutorial form')}`;
  }
  return 'https://www.youtube.com';
}

export function getYoutubeSearchUrl(exerciseName: string): string {
  return `https://www.youtube.com/results?search_query=${encodeURIComponent(exerciseName + ' exercise workout form tutorial')}`;
}

export function getYoutubeThumbnailUrl(youtubeUrlOrId?: string): string {
  const videoId = extractYoutubeId(youtubeUrlOrId);
  if (videoId) {
    return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
  }
  return '';
}

