'use client'

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { Pagination, PaginationContent, PaginationItem, PaginationNext, PaginationPrevious } from "@/components/ui/pagination"

const IMAGES = [
  "/cal1.jpg",
  "/cal2.jpg",
  "/cal3.jpg",
  "/cal4.jpg",
  "/cal5.jpg",
  // Dodaj więcej jak chcesz
]
const IMAGES_PER_PAGE = 3
export default function CalendarPage() {
  const [prompt, setPrompt] = useState("")
  const [currentPage, setCurrentPage] = useState(1)

  const totalPages = Math.ceil(IMAGES.length / IMAGES_PER_PAGE)
  const startIndex = (currentPage - 1) * IMAGES_PER_PAGE
  const currentImages = IMAGES.slice(startIndex, startIndex + IMAGES_PER_PAGE)

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1)
  }

  const handlePrevious = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1)
  }
  const handleSubmit = () => {
    console.log("Wpisany prompt:", prompt)
  }

  return (
    <div>
      <div className="flex justify-center gap-10">

        <div className=" items-center p-5 rounded-2xl h-fit bg-gray-300">
          <h2 className="text-xl font-medium m-2">Wygeneruj tło za pomocą AI</h2>
          <div className="flex items-center gap-2">
            <Input
              type="text"
              placeholder="Prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
            <Button type="button" variant="outline" onClick={handleSubmit}>
              Generuj
            </Button>
          </div>
        </div>

        <div className="bg-gray-600 p-4 rounded-2xl">

          <h1 className="text-2xl font-bold mb-4">Podgląd</h1>

          <div className=" grid grid-cols-3 gap-3">
            {currentImages.map((src, index) => (
              <img
                key={index}
                src={src}
                width={300}
                height={300}
                alt={`Zdjęcie ${startIndex + index + 1}`}
                className=" shadow-md  object-cover"
              />
            ))}
          </div>

          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious onClick={handlePrevious} className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''} />
              </PaginationItem>

              <PaginationItem className="text-sm px-4 pt-2">
                {currentPage} z {totalPages}
              </PaginationItem>

              <PaginationItem>
                <PaginationNext onClick={handleNext} className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''} />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>


      </div>





    </div>
  )
}
