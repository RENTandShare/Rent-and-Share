import React from 'react';
import { City } from '../../types';
import { MapPin, X, Check } from 'lucide-react';

interface CitySelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCity: City;
  onSelectCity: (city: City) => void;
}

const CITIES: { name: City; state: string; popular?: boolean }[] = [
  { name: 'Hyderabad', state: 'Telangana', popular: true },
  { name: 'Bengaluru', state: 'Karnataka', popular: true },
  { name: 'Mumbai', state: 'Maharashtra', popular: true },
  { name: 'Delhi NCR', state: 'Delhi / Haryana / UP', popular: true },
  { name: 'Pune', state: 'Maharashtra', popular: true },
  { name: 'Chennai', state: 'Tamil Nadu', popular: true },
  { name: 'Vijayawada', state: 'Andhra Pradesh', popular: true },
  { name: 'Visakhapatnam', state: 'Andhra Pradesh', popular: true },
  { name: 'Amaravati', state: 'Andhra Pradesh', popular: true },
];

export const CitySelectorModal: React.FC<CitySelectorModalProps> = ({
  isOpen,
  onClose,
  selectedCity,
  onSelectCity,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl relative border border-neutral-100">
        <div className="flex items-center justify-between pb-4 border-b border-neutral-100">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-[#FFF3EA] text-[#F26B21] flex items-center justify-center">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-[#1F1F1F]">Select Your City</h3>
              <p className="text-xs text-[#6B6B6B]">Delivery and pricing will be tailored to your city</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-neutral-700 p-1 rounded-full hover:bg-neutral-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 my-5">
          {CITIES.map((c) => {
            const isSelected = selectedCity === c.name;
            return (
              <button
                key={c.name}
                onClick={() => {
                  onSelectCity(c.name);
                  onClose();
                }}
                className={`p-3 rounded-2xl border text-left transition-all relative flex flex-col justify-between ${
                  isSelected
                    ? 'border-[#F26B21] bg-[#FFF3EA] shadow-xs'
                    : 'border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50'
                }`}
              >
                <div>
                  <p className={`font-semibold text-sm ${isSelected ? 'text-[#F26B21]' : 'text-[#1F1F1F]'}`}>
                    {c.name}
                  </p>
                  <p className="text-[11px] text-[#6B6B6B] mt-0.5">{c.state}</p>
                </div>
                {isSelected && (
                  <span className="mt-2 inline-flex items-center gap-1 text-[10px] font-bold text-[#F26B21]">
                    <Check className="w-3.5 h-3.5" /> Selected
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <div className="bg-neutral-50 p-3 rounded-xl text-center text-xs text-[#6B6B6B]">
          Expanding rapidly across South & Central India. Free doorstep delivery in all serviced locations!
        </div>
      </div>
    </div>
  );
};
