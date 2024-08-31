import Image from "next/image";
import { NextPage } from "next";

const Home: NextPage = () => {
  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 text-gray-900 dark:bg-gray-900 dark:text-gray-100">
      {/* Header */}
      <header>
      </header>

      {/* Main Section */}
      <main className="flex-grow flex flex-col items-center py-12">
        <div className="text-center px-6 md:px-12">
          <h2 className="text-4xl font-extrabold mt-8 mb-4">
            Explore the Future of Real Estate!
          </h2>
          <p className="text-lg md:text-xl mb-8">
            🌐 Discover and invest in virtual real estate properties. Our platform lets you buy, sell, and showcase virtual land and assets with ease. Use our intuitive tools to navigate the virtual world and make informed investment decisions.
          </p>
           <p className="text-lg md:text-xl mb-8">
            🏠 From virtual mansions to commercial spaces, explore a variety of properties in a dynamic digital environment. Take virtual tours, visualize your future investments, and engage with a thriving community of real estate enthusiasts.
          </p>
          <Image
            src="/new.jpg"
            width={1200}
            height={200}
            alt="Virtual Real Estate Banner"
            className="rounded-lg shadow-luxury"
          />
          
         
        </div>

        {/* Property Showcase Section */}
        <section id="properties" className="w-full py-12">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold text-center mb-8">Featured Properties</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-luxury">
                <Image
                  src="/banner.png"
                  width={400}
                  height={250}
                  alt="Property 1"
                  className="w-full h-48 object-cover rounded-t-lg"
                />
                <h3 className="text-xl font-semibold mt-4">Luxury Virtual Mansion</h3>
                <p className="mt-2 text-gray-600 dark:text-gray-400">A grand virtual mansion with breathtaking views and high-end amenities.</p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-luxury">
                <Image
                  src="/kind.png"
                  width={400}
                  height={250}
                  alt="Property 2"
                  className="w-full h-48 object-cover rounded-t-lg"
                />
                <h3 className="text-xl font-semibold mt-4">Modern Virtual Office Space</h3>
                <p className="mt-2 text-gray-600 dark:text-gray-400">An ideal workspace in the virtual world with cutting-edge facilities.</p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-luxury">
                <Image
                  src="/Mask1.png"
                  width={400}
                  height={250}
                  alt="Property 3"
                  className="w-full h-48 object-cover rounded-t-lg"
                />
                <h3 className="text-xl font-semibold mt-4">Charming Virtual Cottage</h3>
                <p className="mt-2 text-gray-600 dark:text-gray-400">A cozy virtual cottage perfect for relaxing and socializing.</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer>
      </footer>
    </div>
  );
};

export default Home;