import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Project {
  id: string;
  name: string;
  description: string;
  fullDescription: string;
  websiteUrl: string;
  wedogoodUrl: string;
  telegramUrl: string;
  image: string;
  coo?: {
    name: string;
    email: string;
    percentage: number;
  };
  cmo?: {
    name: string;
    email: string;
    percentage: number;
  };
}

interface DataContextType {
  projects: Project[];
  loading: boolean;
  addProject: (project: Omit<Project, 'id'>) => void;
  updateProject: (id: string, updates: Partial<Project>) => void;
  deleteProject: (id: string) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('📦 Chargement des projets depuis localStorage');
    // Force la réinitialisation avec les nouveaux projets
    initializeDefaultProjects();
    setLoading(false);
  }, []);

  const initializeDefaultProjects = () => {
    const defaultProjects = [
      {
        id: '1',
        name: 'Chess Value',
        description: 'Chess Value évalue en temps réel la valeur des pièces selon la position, pour analyser et améliorer vos stratégies aux échecs.',
        fullDescription: 'Chess Value évalue en temps réel la valeur des pièces selon la position, pour analyser et améliorer vos stratégies aux échecs.',
        websiteUrl: 'https://chessvalue.com',
        wedogoodUrl: 'https://wedogood.co/projects/chessvalue',
        telegramUrl: 'https://t.me/ChessValue',
        image: '/logos/ChessValue.png',
        coo: {
          name: 'Recherche active',
          email: '',
          percentage: 15
        },
        cmo: {
          name: 'Recherche active',
          email: '',
          percentage: 5
        }
      },
      {
        id: '2',
        name: 'Chess 13',
        description: 'Un plateau de 13 x 13. Un attaquant aux bords, un défenseur au centre. Préparez votre stratégie positionnel et matez votre adversaire !',
        fullDescription: 'Un plateau de 13 x 13. Un attaquant aux bords, un défenseur au centre. Préparez votre stratégie positionnel et matez votre adversaire !',
        websiteUrl: 'https://chess13.com',
        wedogoodUrl: 'https://wedogood.co/projects/chess13',
        telegramUrl: 'https://t.me/Chess13Game',
        image: '/logos/Chess13.png',
        coo: {
          name: 'Recherche active',
          email: '',
          percentage: 15
        },
        cmo: {
          name: 'Recherche active',
          email: '',
          percentage: 5
        }
      },
      {
        id: '3',
        name: 'Chess 100',
        description: 'Atteignez la 100e rangée sur un plateau 100 x 8. Créez vos parcours, relevez ceux des autres et devenez le plus rapide.',
        fullDescription: 'Atteignez la 100e rangée sur un plateau 100 x 8. Créez vos parcours, relevez ceux des autres et devenez le plus rapide.',
        websiteUrl: 'https://chess100.com',
        wedogoodUrl: 'https://wedogood.co/projects/chess100',
        telegramUrl: 'https://t.me/Chess100Game',
        image: '/logos/Chess100.png',
        coo: {
          name: 'Recherche active',
          email: '',
          percentage: 15
        },
        cmo: {
          name: 'Recherche active',
          email: '',
          percentage: 5
        }
      },
      {
        id: '4',
        name: 'Draft Chess',
        description: 'L\'échiquier où la partie commence avant le premier coup, en plaçant vos pièces tour à tour avec votre adversaire',
        fullDescription: 'L\'échiquier où la partie commence avant le premier coup, en plaçant vos pièces tour à tour avec votre adversaire',
        websiteUrl: 'https://draftchess.com',
        wedogoodUrl: 'https://wedogood.co/projects/draftchess',
        telegramUrl: 'https://t.me/DraftChessGame',
        image: '/logos/DraftChess.png',
        coo: {
          name: 'Recherche active',
          email: '',
          percentage: 15
        },
        cmo: {
          name: 'Recherche active',
          email: '',
          percentage: 5
        }
      },
    ];
    
    setProjects(defaultProjects);
    localStorage.setItem('projects', JSON.stringify(defaultProjects));
    console.log('✅ Projets par défaut initialisés');
  };

  const addProject = (projectData: Omit<Project, 'id'>) => {
    const newProject: Project = {
      id: Date.now().toString(),
      ...projectData
    };
    
    const updatedProjects = [newProject, ...projects];
    setProjects(updatedProjects);
    localStorage.setItem('projects', JSON.stringify(updatedProjects));
    console.log('✅ Nouveau projet ajouté:', newProject.name);
  };

  const updateProject = (id: string, updates: Partial<Project>) => {
    const updatedProjects = projects.map(project => 
      project.id === id ? { ...project, ...updates } : project
    );
    setProjects(updatedProjects);
    localStorage.setItem('projects', JSON.stringify(updatedProjects));
    console.log('✅ Projet mis à jour:', id);
  };

  const deleteProject = (id: string) => {
    const updatedProjects = projects.filter(project => project.id !== id);
    setProjects(updatedProjects);
    localStorage.setItem('projects', JSON.stringify(updatedProjects));
    console.log('✅ Projet supprimé:', id);
  };

  return (
    <DataContext.Provider value={{ 
      projects, 
      loading,
      addProject,
      updateProject,
      deleteProject
    }}>
      {children}
    </DataContext.Provider>
  );
}

const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

export { useData };