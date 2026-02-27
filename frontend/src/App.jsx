import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Monsters from './pages/Monsters';
import MonsterDetail from './pages/MonsterDetail';
import Weapons from './pages/Weapons';
import WeaponDetail from './pages/WeaponDetail';
import Armor from './pages/Armor';
import ArmorDetail from './pages/ArmorDetail';
import Quests from './pages/Quests';
import QuestDetail from './pages/QuestDetail';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
            <Route path="/monsters" element={<Monsters />} />
            <Route path="/monsters/:id" element={<MonsterDetail />} />
            <Route path="/weapons" element={<Weapons />} />
            <Route path="/weapons/:id" element={<WeaponDetail />} />
            <Route path="/armor" element={<Armor />} />
            <Route path="/armor/:id" element={<ArmorDetail />} />
            <Route path="/quests" element={<Quests />} />
            <Route path="/quests/:id" element={<QuestDetail />} />
          </Routes>
        </main>
      </BrowserRouter>
    </AuthProvider>
  );
}
