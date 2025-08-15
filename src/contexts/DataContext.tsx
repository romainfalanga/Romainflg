import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Project {
  id: string;
  slug: string;
  name: string;
  description: string;
  fullDescription: string;
  websiteUrl: string;
  wedogoodUrl: string;
  telegramUrl: string;
  image: string;
  cm1?: {
    name: string;
    email: string;
    tiktokAccount: string;
    percentage: number;
  };
  cm2?: {
    name: string;
    email: string;
    tiktokAccount: string;
    percentage: number;
  };
  cm3?: {
    name: string;
    email: string;
    tiktokAccount: string;
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
    loadProjects();
    setLoading(false);
  }, []);

  const loadProjects = () => {
    // Forcer le rechargement des projets par défaut avec les nouveaux slugs
    localStorage.removeItem('projects'); // Nettoyer l'ancien format
    
    const defaultProjects = [
      {
        id: '1',
        slug: 'chess-value',
        name: 'Chess Value',
        description: 'Chess Value évalue en temps réel la valeur des pièces selon la position, pour analyser et améliorer vos stratégies aux échecs.',
        fullDescription: 'Chess Value évalue en temps réel la valeur des pièces selon la position, pour analyser et améliorer vos stratégies aux échecs.',
        websiteUrl: 'https://chess-value.com',
        wedogoodUrl: 'https://wedogood.co/projects/chessvalue',
        telegramUrl: 'https://t.me/ChessValue',
        image: '/logos/ChessValue.png',
        cm1: {
          name: 'Recherche active',
          email: '',
          tiktokAccount: '',
          percentage: 10
        },
        cm2: {
          name: 'Recherche active',
          email: '',
          tiktokAccount: '',
          percentage: 10
        },
        cm3: {
          name: 'Recherche active',
          email: '',
          tiktokAccount: '',
          percentage: 10
        }
      },
      {
        id: '2',
        slug: 'chess-13',
        name: 'Chess 13',
        description: 'Un plateau de 13 x 13. Un attaquant aux bords, un défenseur au centre. Préparez votre stratégie positionnel et matez votre adversaire !',
        fullDescription: 'Un plateau de 13 x 13. Un attaquant aux bords, un défenseur au centre. Préparez votre stratégie positionnel et matez votre adversaire !',
        websiteUrl: 'https://chess-13.com',
        wedogoodUrl: 'https://wedogood.co/projects/chess13',
        telegramUrl: 'https://t.me/Chess13Game',
        image: '/logos/Chess13.png',
        cm1: {
          name: 'Recherche active',
          email: '',
          tiktokAccount: '',
          percentage: 10
        },
        cm2: {
          name: 'Recherche active',
          email: '',
          tiktokAccount: '',
          percentage: 10
        },
        cm3: {
          name: 'Recherche active',
          email: '',
          tiktokAccount: '',
          percentage: 10
        }
      },
      {
        id: '3',
        slug: 'chess-100',
        name: 'Chess 100',
        description: 'Atteignez la 100e rangée sur un plateau 100 x 8. Créez vos parcours, relevez ceux des autres et devenez le plus rapide.',
        fullDescription: 'Atteignez la 100e rangée sur un plateau 100 x 8. Créez vos parcours, relevez ceux des autres et devenez le plus rapide.',
        websiteUrl: 'https://chess-100.com',
        wedogoodUrl: 'https://wedogood.co/projects/chess100',
        telegramUrl: 'https://t.me/Chess100Game',
        image: '/logos/Chess100.png',
        cm1: {
          name: 'Recherche active',
          email: '',
          tiktokAccount: '',
          percentage: 10
        },
        cm2: {
          name: 'Recherche active',
          email: '',
          tiktokAccount: '',
          percentage: 10
        },
        cm3: {
          name: 'Recherche active',
          email: '',
          tiktokAccount: '',
          percentage: 10
        }
      },
      {
        id: '4',
        slug: 'draft-chess',
        name: 'Draft Chess',
        description: 'L\'échiquier où la partie commence avant le premier coup, en plaçant vos pièces tour à tour avec votre adversaire',
        fullDescription: 'L\'échiquier où la partie commence avant le premier coup, en plaçant vos pièces tour à tour avec votre adversaire',
        websiteUrl: 'https://draft-chess.com',
        wedogoodUrl: 'https://wedogood.co/projects/draftchess',
        telegramUrl: 'https://t.me/DraftChessGame',
        image: '/logos/DraftChess.png',
        cm1: {
          name: 'Recherche active',
          email: '',
          tiktokAccount: '',
          percentage: 10
        },
        cm2: {
          name: 'Recherche active',
          email: '',
          tiktokAccount: '',
          percentage: 10
        },
        cm3: {
          name: 'Recherche active',
          email: '',
          tiktokAccount: '',
          percentage: 10
        }
      },
    ];
    
    setProjects(defaultProjects);
    localStorage.setItem('projects', JSON.stringify(defaultProjects));
  };

  const addProject = (projectData: Omit<Project, 'id'>) => {
    const newProject: Project = {
      id: Date.now().toString(),
      ...projectData
    };
    
    const updatedProjects = [newProject, ...projects];
    setProjects(updatedProjects);
    localStorage.setItem('projects', JSON.stringify(updatedProjects));
  };

  const updateProject = (id: string, updates: Partial<Project>) => {
    const updatedProjects = projects.map(project => 
      project.id === id ? { ...project, ...updates } : project
    );
    setProjects(updatedProjects);
    localStorage.setItem('projects', JSON.stringify(updatedProjects));
  };

  const deleteProject = (id: string) => {
    const updatedProjects = projects.filter(project => project.id !== id);
    setProjects(updatedProjects);
    localStorage.setItem('projects', JSON.stringify(updatedProjects));
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