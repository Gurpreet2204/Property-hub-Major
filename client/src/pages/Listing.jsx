import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore from 'swiper';
import { useSelector } from 'react-redux';
import { Navigation } from 'swiper/modules';
import 'swiper/css/bundle';
import {
  FaBath,
  FaBed,
  FaChair,
  FaMapMarkerAlt,
  FaParking,
  FaShare,
} from 'react-icons/fa';
import Contact from '../components/Contact';
import AppointmentForm from './AppointmentForm';
// import Payment from './payment';

SwiperCore.use([Navigation]);

export default function Listing() {
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [copied, setCopied] = useState(false);
  const [contact, setContact] = useState(false);
  const params = useParams();
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/listing/get/${params.listingId}`);
        const data = await res.json();
        if (data.success === false) {
          setError(true);
          setLoading(false);
          return;
        }
        setListing(data);
        setLoading(false);
        setError(false);
      } catch (error) {
        setError(true);
        setLoading(false);
      }
    };
    fetchListing();
  }, [params.listingId]);

  return (
    <main>
      {loading && <p className='text-center my-7 text-2xl'>Loading...</p>}
      {error && <p className='text-center my-7 text-2xl'>Something went wrong!</p>}
      {listing && !loading && !error && (
        <div>
          <Swiper navigation>
            {listing.imageUrls.map((url) => (
              <SwiperSlide key={url}>
                <div
                  className='h-[550px] rounded-lg shadow-lg overflow-hidden'
                  style={{
                    background: `url(${url}) center no-repeat`,
                    backgroundSize: 'cover',
                  }}
                ></div>
              </SwiperSlide>
            ))}
          </Swiper>
          <div className='fixed top-[13%] right-[3%] z-10 border rounded-full w-12 h-12 flex justify-center items-center bg-slate-100 cursor-pointer'>
            <FaShare
              className='text-slate-500'
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                setCopied(true);
                setTimeout(() => {
                  setCopied(false);
                }, 2000);
              }}
            />
          </div>
          {copied && (
            <p className='fixed top-[23%] right-[5%] z-10 rounded-md bg-slate-100 p-2'>
              Link copied!
            </p>
          )}
          <div className='flex flex-col max-w-4xl mx-auto p-3 my-7 gap-4'>
            <p className='text-2xl font-semibold'>
              {listing.name} - ₹{' '}
              {listing.offer
                ? listing.discountPrice.toLocaleString('en-US')
                : listing.regularPrice.toLocaleString('en-US')}
              {listing.type === 'rent' && ' / month'}
            </p>
            <p className='flex items-center mt-6 gap-2 text-slate-600 text-sm'>
              <FaMapMarkerAlt className='text-green-700' />
              {listing.address}
            </p>
            <div className='flex gap-4'>
              <p className='bg-red-900 w-full max-w-[200px] text-white text-center p-1 rounded-md'>
                {listing.type === 'rent' ? 'For Rent' : 'For Sale'}
              </p>
              {listing.offer && (
                <p className='bg-green-900 w-full max-w-[200px] text-white text-center p-1 rounded-md'>
                  ₹{listing.regularPrice - +listing.discountPrice} OFF
                </p>
              )}
            </div>
            <p className='text-slate-800'>
              <span className='font-semibold text-black'>Description - </span>
              {listing.description}
            </p>

            <ul className='text-green-900 font-semibold text-sm flex flex-wrap items-center gap-4 sm:gap-6'>
              <li className='flex items-center gap-1 whitespace-nowrap '>
                <FaBed className='text-lg' />
                {listing.bedrooms > 1
                  ? `${listing.bedrooms} beds `
                  : `${listing.bedrooms} bed `}
              </li>
              <li className='flex items-center gap-1 whitespace-nowrap '>
                <FaBath className='text-lg' />
                {listing.bathrooms > 1
                  ? `${listing.bathrooms} baths `
                  : `${listing.bathrooms} bath `}
              </li>
              <li className={`flex items-center gap-1 whitespace-nowrap ${listing.parking ? 'text-green-900' : 'text-red-500'}`}>
                <FaParking className='text-lg' />
                {listing.parking ? 'Parking spot' : 'No Parking'}
              </li>
              <li className={`flex items-center gap-1 whitespace-nowrap ${listing.furnished ? 'text-green-900' : 'text-red-500'}`}>
                <FaChair className='text-lg' />
                {listing.furnished ? 'Furnished' : 'Unfurnished'}
              </li>


              <li className={`flex items-center gap-1 whitespace-nowrap ${listing.villa ? 'text-green-900' : 'text-red-500'}`}>

                {listing.villa ? 'Villa' : ' '}
              </li>
              <li className={`flex items-center gap-1 whitespace-nowrap ${listing.bunglow ? 'text-green-900' : 'text-red-500'}`}>

                {listing.bunglow ? 'bunglow' : ' '}
              </li>
              <li className={`flex items-center gap-1 whitespace-nowrap ${listing.townhouse ? 'text-green-900' : 'text-red-500'}`}>

                {listing.townhouse ? 'townhouse' : ' '}
              </li>
              <li className={`flex items-center gap-1 whitespace-nowrap ${listing.appartment ? 'text-green-900' : 'text-red-500'}`}>

                {listing.appartment ? 'appartment' : ' '}
              </li>
              <li className={`flex items-center gap-1 whitespace-nowrap ${listing.condominum ? 'text-green-900' : 'text-red-500'}`}>

                {listing.condominum ? 'condominum' : ' '}
              </li>
              <li className={`flex items-center gap-1 whitespace-nowrap ${listing.duplex ? 'text-green-900' : 'text-red-500'}`}>

                {listing.duplex ? 'duplex' : ' '}
              </li>
              <li className={`flex items-center gap-1 whitespace-nowrap ${listing.triplex ? 'text-green-900' : 'text-red-500'}`}>

                {listing.triplex ? 'triplex' : ' '}
              </li>
              <li className={`flex items-center gap-1 whitespace-nowrap ${listing.other ? 'text-green-900' : 'text-red-500'}`}>

                {listing.other ? 'other' : ' '}
              </li>
            </ul>
            <ul>

            </ul>
            <p className='text-slate-800'>
              <span className='font-semibold text-red-500'>Fee for the Appointment - ₹<b>{listing.appointmentFees} </b></span>

            </p>
            <br />
            {contact && <Contact listing={listing} />}
            {currentUser && listing.userRef !== currentUser._id && !contact && (<AppointmentForm />)}
            <br />
            
            {/* {currentUser && listing.userRef !== currentUser._id && !contact && (
              <button
                type="submit"
                className="bg-green-700 text-white py-2 px-4 rounded-md hover:opacity-95 focus:outline-none"
              >
                <Payment />
              </button>)} */}

            {currentUser && listing.userRef !== currentUser._id && !contact && (
              <button
                onClick={() => setContact(true)}
                className='bg-green-700 text-white rounded-lg uppercase hover:opacity-95 p-3'
              >
                Contact landlord
              </button>
            )}
            <br />



          </div>
        </div>
      )}
    </main>

  )
}