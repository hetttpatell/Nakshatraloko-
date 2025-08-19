
import React, { useState } from "react";
import Input from "../Input/Input";
import { Filter } from "lucide-react";

export default function Gemstones() {
  const [filters, setFilters] = useState({
    filter1: "",
    filter2: '',
    filter3: '',
    filter4: ''
  });

  const handleChange = () => {

  }
  const optionsfilter = {
    filter1: ['Apple', 'Banana', 'Orange'],
    filter2: ['Apple1', 'Banana1', 'Orange1'],
    filter3: ['Apple2', 'Banana2', 'Orange2'],
    filter4: ['Apple3', 'Banana3', 'Orange3']
  }
  return (
    <>
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-[var(--color-bg)]">
        <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-[var(--color-bg)]">
          {Object.keys(optionsfilter).map((item) => (
            <Input
              key={item} // React key
              type="select"
              options={optionsfilter[item]}
              value={filters[item]}
              onChange={(e) => {
                setFilters(prev => ({
                  ...prev,
                  [item]: e.target.value
                }))
              }}
              placeholder={`Choose a ${item}`}
            />
          ))}
        </div>

      </div>
    </>
  );
}