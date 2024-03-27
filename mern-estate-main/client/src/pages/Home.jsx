import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import SwiperCore from 'swiper';
import 'swiper/css/bundle';
import ListingItem from '../components/ListingItem';

SwiperCore.use([Navigation]);

const Home = () => {
  const [offerListings, setOfferListings] = useState([]);
  const [saleListings, setSaleListings] = useState([]);
  const [rentListings, setRentListings] = useState([]);

  useEffect(() => {
    const fetchOfferListings = async () => {
      try {
        const res = await fetch('/api/listing/get?offer=true&limit=4');
        const data = await res.json();
        setOfferListings(data);
        fetchRentListings();
      } catch (error) {
        console.log(error);
      }
    };

    const fetchRentListings = async () => {
      try {
        const res = await fetch('/api/listing/get?type=rent&limit=4');
        const data = await res.json();
        setRentListings(data);
        fetchSaleListings();
      } catch (error) {
        console.log(error);
      }
    };

    const fetchSaleListings = async () => {
      try {
        const res = await fetch('/api/listing/get?type=sale&limit=4');
        const data = await res.json();
        setSaleListings(data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchOfferListings();
  }, []);

  return (
    <div>
      <div className="w-full">
        <Swiper navigation>
          {offerListings &&
            offerListings.length > 0 &&
            offerListings.map((listing) => (
              <SwiperSlide key={listing._id}>
                <div
                  style={{
                    background: `url(${listing.imageUrls[0]}) center no-repeat`,
                    backgroundSize: 'cover',
                  }}
                  className="h-[500px]"
                ></div>
              </SwiperSlide>
            ))}
        </Swiper>
      </div><br />
      <div className="border rounded-2xl bg-white p-10 px-3 max-w-6xl mx-auto text-gray-800 shadow-lg">
        <h1 className="text-4xl lg:text-6xl font-extrabold mb-4">
          Discover Your Dream Home
        </h1>
        <div className="text-sm sm:text-base mb-4">
          Find the perfect place to live with Property Hub's wide range of unique and stylish properties.
        </div>
        <Link
          to={'/search'}
          className="text-sm sm:text-base font-bold hover:underline transition-colors duration-300 hover:text-blue-600"
        >
          Start Your Journey
        </Link>
      </div>
      <div className="max-w-6xl mx-auto p-5 flex flex-col gap-8 my-10">
        {offerListings && offerListings.length > 0 && (
          <div className="">
            <div className="my-3 flex justify-between items-center">
              <h2 className="text-3xl font-extrabold text-blue-800">Featured Offers</h2>
              <Link
                className="text-base text-blue-800 hover:underline transition-colors duration-300 hover:text-blue-600"
                to={'/search?offer=true'}
              >
                Explore More Offers
              </Link>
            </div>
            <div className="p-3 px-2">
              <div className="broder rounded-xl flex flex-wrap gap-4">
                {offerListings.map((listing) => (
                  <ListingItem listing={listing} key={listing._id} />
                ))}
              </div>
            </div>
          </div>
        )}
        {rentListings && rentListings.length > 0 && (
          <div className="">
            <div className="my-3 flex justify-between items-center">
              <h2 className="text-3xl font-extrabold text-blue-400">Homes for Rent</h2>
              <Link
                className="text-base text-blue-800 hover:underline transition-colors duration-300 hover:text-blue-600"
                to={'/search?type=rent'}
              >
                Find Your Rental
              </Link>
            </div>
            <div className="flex flex-wrap gap-4">
              {rentListings.map((listing) => (
                <ListingItem listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}
        {saleListings && saleListings.length > 0 && (
          <div className="">
            <div className="my-3 flex justify-between items-center">
              <h2 className="text-3xl font-extrabold text-red-950">Homes for Sale</h2>
              <Link
                className="text-base text-blue-800 hover:underline transition-colors duration-300 hover:text-blue-600"
                to={'/search?type=sale'}
              >
                Explore Properties for Sale
              </Link>
            </div>
            <div className="flex flex-wrap gap-4">
              {saleListings.map((listing) => (
                <ListingItem listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;