import React from 'react';
import TeacherSideBar from '../components/TeacherSideBar';
import { Outlet } from 'react-router-dom';

const TeacherPanel = () => {
  return (
    <div className='flex h-screen'>
      <TeacherSideBar />
      <main className='flex-1 p-4'>
        <Outlet /> 
      </main>
    </div>
  );
};

export default TeacherPanel;
