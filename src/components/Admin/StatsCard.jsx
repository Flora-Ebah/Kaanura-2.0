import React from 'react';

const StatsCard = ({ title, value, icon, trend, color }) => {
    return (
        <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <p className="text-sm text-[#8B5E34]">{title}</p>
                    <h3 className="text-2xl font-medium text-[#4A2B0F]">{value}</h3>
                </div>
                <div className={`p-3 rounded-full`} style={{ backgroundColor: `${color}20` }}>
                    <span style={{ color: color }}>{icon}</span>
                </div>
            </div>
            <div className="flex items-center">
                <span className="text-sm" style={{ color: color }}>{trend}</span>
                <span className="text-sm text-[#8B5E34] ml-2">vs mois dernier</span>
            </div>
        </div>
    );
};

export default StatsCard; 