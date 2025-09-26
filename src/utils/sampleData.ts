import { Subject, StudyMaterial } from '../types';

export const sampleSubjects: Subject[] = [
  {
    id: '1',
    name: 'Biology',
    color: '#10B981',
    icon: '🧬',
    createdAt: new Date('2024-01-15'),
    lastStudied: new Date('2024-01-20'),
    totalStudyTime: 180,
    masteryLevel: 75
  },
  {
    id: '2',
    name: 'Mathematics',
    color: '#3B82F6',
    icon: '🧮',
    createdAt: new Date('2024-01-10'),
    lastStudied: new Date('2024-01-19'),
    totalStudyTime: 240,
    masteryLevel: 60
  },
  {
    id: '3',
    name: 'History',
    color: '#8B5CF6',
    icon: '🏛️',
    createdAt: new Date('2024-01-12'),
    lastStudied: new Date('2024-01-18'),
    totalStudyTime: 120,
    masteryLevel: 45
  }
];

export const sampleMaterials: StudyMaterial[] = [
  {
    id: '1',
    subjectId: '1',
    title: 'Cell Structure and Function',
    content: 'Cells are the basic structural and functional units of all living organisms. They contain various organelles that perform specific functions. The nucleus contains genetic material, mitochondria produce energy, and the cell membrane controls what enters and exits the cell. Understanding cell structure is fundamental to biology and helps explain how living things function at the most basic level.',
    type: 'text',
    createdAt: new Date('2024-01-15'),
    lastReviewed: new Date('2024-01-20'),
    difficulty: 'medium',
    tags: ['cell biology', 'organelles', 'structure']
  },
  {
    id: '2',
    subjectId: '1',
    title: 'Photosynthesis Process',
    content: 'Photosynthesis is the process by which plants convert light energy into chemical energy. It occurs in the chloroplasts and involves two main stages: the light-dependent reactions and the Calvin cycle. During this process, carbon dioxide and water are converted into glucose and oxygen using sunlight energy. This process is crucial for life on Earth as it produces oxygen and forms the base of most food chains.',
    type: 'text',
    createdAt: new Date('2024-01-16'),
    lastReviewed: new Date('2024-01-19'),
    difficulty: 'hard',
    tags: ['photosynthesis', 'energy', 'plants']
  },
  {
    id: '3',
    subjectId: '2',
    title: 'Quadratic Equations',
    content: 'A quadratic equation is a polynomial equation of degree 2, typically written as ax² + bx + c = 0. There are several methods to solve quadratic equations: factoring, completing the square, and using the quadratic formula. The discriminant (b² - 4ac) determines the nature of the roots. Understanding quadratics is essential for advanced mathematics and has applications in physics, engineering, and economics.',
    type: 'text',
    createdAt: new Date('2024-01-10'),
    lastReviewed: new Date('2024-01-18'),
    difficulty: 'medium',
    tags: ['algebra', 'equations', 'quadratic']
  },
  {
    id: '4',
    subjectId: '2',
    title: 'Trigonometric Functions',
    content: 'Trigonometric functions relate angles to ratios of sides in right triangles. The six main functions are sine, cosine, tangent, cosecant, secant, and cotangent. These functions are periodic and have applications in wave analysis, physics, engineering, and computer graphics. Understanding trigonometry is crucial for advanced mathematics and many scientific fields.',
    type: 'text',
    createdAt: new Date('2024-01-12'),
    lastReviewed: new Date('2024-01-17'),
    difficulty: 'hard',
    tags: ['trigonometry', 'functions', 'angles']
  },
  {
    id: '5',
    subjectId: '3',
    title: 'World War II Timeline',
    content: 'World War II lasted from 1939 to 1945 and involved most of the world\'s nations. Key events include the invasion of Poland (1939), the attack on Pearl Harbor (1941), the Battle of Stalingrad (1942-1943), D-Day (1944), and the atomic bombings of Japan (1945). The war resulted in significant geopolitical changes and the establishment of the United Nations.',
    type: 'text',
    createdAt: new Date('2024-01-12'),
    lastReviewed: new Date('2024-01-16'),
    difficulty: 'easy',
    tags: ['world war', 'timeline', 'history']
  },
  {
    id: '6',
    subjectId: '3',
    title: 'Renaissance Art and Culture',
    content: 'The Renaissance was a period of cultural rebirth in Europe from the 14th to 17th centuries. It marked a shift from medieval to modern thinking, with emphasis on humanism, scientific inquiry, and artistic innovation. Key figures include Leonardo da Vinci, Michelangelo, and Raphael. The Renaissance had profound effects on art, literature, science, and philosophy.',
    type: 'text',
    createdAt: new Date('2024-01-14'),
    lastReviewed: new Date('2024-01-15'),
    difficulty: 'medium',
    tags: ['renaissance', 'art', 'culture']
  }
];

export const initializeSampleData = () => {
  // Check if data already exists
  const existingSubjects = localStorage.getItem('subjects');
  const existingMaterials = localStorage.getItem('materials');
  
  if (!existingSubjects) {
    localStorage.setItem('subjects', JSON.stringify(sampleSubjects));
  }
  
  if (!existingMaterials) {
    localStorage.setItem('materials', JSON.stringify(sampleMaterials));
  }
};
