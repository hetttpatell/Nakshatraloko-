import React from "react";
import Input from "../Input/Input";

export default function Gemstones() {
  return (

    <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg)]">
      
      <Input 
        list ="choice"
      />
      <datalist id="choices">
  <option value="Option 1" />
  <option value="Option 2" />
  <option value="Option 3" />
</datalist> 
    
    </div>



  )
}