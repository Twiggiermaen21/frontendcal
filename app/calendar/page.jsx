'use client'

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Pagination, PaginationContent, PaginationItem, PaginationNext, PaginationPrevious } from "@/components/ui/pagination"

const IMAGES_PER_PAGE = 3
export default function CalendarPage() {
  const [prompt, setPrompt] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [sessionImages, setSessionImages] = useState([])
  const [isLoading, setIsLoading] = useState(false);



  const totalPages = Math.ceil(sessionImages.length / IMAGES_PER_PAGE)
  const startIndex = (currentPage - 1) * IMAGES_PER_PAGE
  const currentImages = sessionImages.slice(startIndex, startIndex + IMAGES_PER_PAGE)
  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1)
  }
  const handlePrevious = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1)
  }




  const handleSubmit = async () => {
    setIsLoading(true);  // ⏳ START ładowania

    try {
      const formData = new FormData();
      formData.append("prompt", prompt);

      const res = await fetch("http://localhost:8000/generate/", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      const imageUrl = `http://localhost:8000/image/${data.image_id}`;

      setSessionImages((prev) => [...prev, { id: data.image_id, url: imageUrl }]);
    } catch (error) {
      console.error("Błąd podczas generowania:", error);
    }

    setIsLoading(false);  // ✅ KONIEC ładowania
  };

  return (
    <div className="p-6">
      <div className="flex flex-col lg:flex-row justify-center gap-10">

        {/* PANEL GENEROWANIA */}
        <div className="bg-gray-300 p-6 rounded-2xl h-fit w-full max-w-md">
          <h2 className="text-xl font-medium mb-4">Wygeneruj tło za pomocą AI</h2>

          <div className="flex items-center gap-2">
            <Input
              type="text"
              placeholder="Prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="flex-1"
            />

            <Button type="button" variant="outline" onClick={handleSubmit} disabled={isLoading}>
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4 text-gray-600" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  Generuję...
                </span>
              ) : (
                "Generuj"
              )}
            </Button>
          </div>
        </div>

        {/* PODGLĄD OBRAZÓW */}
        <div className="bg-gray-700 p-6 rounded-2xl w-full max-w-5xl text-white">
          <h1 className="text-2xl font-bold mb-4">Podgląd</h1>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
            {currentImages.map((src, index) => (
              <div key={index} className="rounded overflow-hidden shadow-lg bg-white">
                <img
                  src={src.url}
                  width={300}
                  height={300}
                  alt={`Zdjęcie ${startIndex + index + 1}`}
                  className="object-cover w-full"
                />
                <div className="p-2 text-xs text-gray-800 break-words">
                  Zdjęcie #{startIndex + index + 1}
                </div>
              </div>
            ))}
          </div>

          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={handlePrevious}
                  className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
                />
              </PaginationItem>

              <PaginationItem className="text-sm px-4 pt-2">
                {currentPage} z {totalPages}
              </PaginationItem>

              <PaginationItem>
                <PaginationNext
                  onClick={handleNext}
                  className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </div>
  )

}
