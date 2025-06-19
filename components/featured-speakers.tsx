const FeaturedSpeakers = () => {
  // Dummy data for featured speakers
  const speakers = [
    {
      name: "Dr. Jane Doe",
      title: "CEO, Tech Innovations Inc.",
      imageUrl: "https://via.placeholder.com/150", // Replace with actual image URL
      bio: "A visionary leader in the tech industry, Dr. Doe has revolutionized...",
    },
    {
      name: "John Smith",
      title: "Lead Developer, Open Source Project",
      imageUrl: "https://via.placeholder.com/150", // Replace with actual image URL
      bio: "John is a passionate open-source advocate and a skilled software engineer...",
    },
    {
      name: "Emily White",
      title: "Marketing Director, Global Corp",
      imageUrl: "https://via.placeholder.com/150", // Replace with actual image URL
      bio: "Emily is an expert in digital marketing and brand strategy...",
    },
  ]

  return (
    <div className="bg-gray-100 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-extrabold text-gray-900 text-center">Featured Speakers</h2>
        <div className="mt-6 grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-3">
          {speakers.map((speaker) => (
            <div key={speaker.name} className="group relative">
              <div className="w-full min-h-80 bg-gray-200 aspect-w-1 aspect-h-1 rounded-md overflow-hidden group-hover:opacity-75 lg:h-80 lg:aspect-none">
                <img
                  src={speaker.imageUrl || "/placeholder.svg"}
                  alt={speaker.name}
                  className="w-full h-full object-center object-cover lg:w-full lg:h-full"
                />
              </div>
              <div className="mt-4 flex justify-between">
                <div>
                  <h3 className="text-sm text-gray-700">
                    <a href="#">
                      <span aria-hidden="true" className="absolute inset-0" />
                      {speaker.name}
                    </a>
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">{speaker.title}</p>
                </div>
              </div>
              <p className="text-sm text-gray-500">{speaker.bio}</p>
            </div>
          ))}
        </div>
        <div className="mt-6 text-center">
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            View All Speakers
          </button>
        </div>
      </div>
    </div>
  )
}

export default FeaturedSpeakers
