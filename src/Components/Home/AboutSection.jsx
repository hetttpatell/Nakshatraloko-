import React from "react";

export default function AboutSection() {
  const aboutpara = {
    first: "About",
    second: "Nakshatraloko",
    para: "This is the sample of the paragraph about section of the company. This is the sample of the paragraph about section of the company.This is the sample of the paragraph about section of the company.This is the sample of the paragraph about section of the company.This is the sample of the paragraph about section of the company.",
    img: "/abot.jpg",
  }
  return (
    <>
      <div className="mt-10 h-150 bg-[var(--color-aboutbg)] py-10">
        <div className="flex flex-col md:flex-row items-start px-3 md:px-20">

          <div className="md:w-1/2">
            <h1 className="text-4xl md:text-6xl lg:text-8xl font-playfair">
              {aboutpara.first}
            </h1>
            <h2 className="text-4xl md:text-6xl lg:text-8xl font-playfair font-bold mt-4">
              {aboutpara.second}
            </h2>
            <p
              className="mt-6 w-full md:w-5/6 text-lg md:text-xl leading-7 md:leading-9 tracking-wide text-justify font-playfair text-gray-700"
            >
              {aboutpara.para}
            </p>


          </div>

          <div className="md:w-1/2 mt-6 md:mt-0 flex justify-end">
            <img
              src="/abot.jpg"
              alt="akshatraloko Image"
              className="w-2/3 md:w-2/3 h-1/2 md:h-1/3 object-cover rounded-4xl"
            />
          </div>

        </div>
      </div>

    </>
  )


}
