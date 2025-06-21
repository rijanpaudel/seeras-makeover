import React from 'react'
import HomeTop from './HomeTop'
import HomeServices from './HomeServices'
import HomePink from './HomePink'
import HomeProducts from './HomeProducts'
import homeAppointment from "../assets/homeappointment.jpg";
import homeCourse from "../assets/homecourse.jpg"
import bridal from "../assets/bridal.png";
import facial from "../assets/facial.png";
import makeover from "../assets/makeover.png";
import haircare from "../assets/haircare.png";
import nailcare from "../assets/nailcare.png";
import makeupClass from "../assets/makeupclass.png"
import nailClass from "../assets/nailclass.png"
import hairCutTraining from "../assets/haircuttraining.png"
import certificate from "../assets/certificate.png"

const Home = () => {
  return (
    <div>
      <HomeTop />
      <HomeServices />
      <HomePink 
        firstTitle="Book" 
        secondTitle="appointment"
        thirdTitle="now"
        paragraph="Welcome to Seera's Makeover! Book your appointment today and indulge in our range of beauty services, including makeup, haircare, nails, and skin treatments. Our online booking system makes it easy to find your perfect time slot and experience the Seera's Makeover difference."
        buttonName="Book Appointment"
        mainImage={homeAppointment}
        services={[
          { img: bridal, label: "Bridal Packages" },
          { img: facial, label: "Facial Care" },
          { img: makeover, label: "Makeup Services" },
          { img: haircare, label: "Hair Care" },
          { img: nailcare, label: "Nail Care" }
        ]}
      />
      <HomeProducts />
      <HomePink 
        firstTitle="Enroll for" 
        secondTitle="beauty"
        thirdTitle="class"
        paragraph="Welcome to Seera's Makeover! Book your appointment today and indulge in our range of beauty services, including makeup, haircare, nails, and skin treatments. Our online booking system makes it easy to find your perfect time slot and experience the Seera's Makeover difference."
        buttonName="Enroll Now"
        mainImage={homeCourse}
        classes={[
          { img: makeupClass, label: "Makeup Class" },
          { img: nailClass, label: "Nail Class" },
          { img: hairCutTraining, label: "Hair Cut Training" },
          { img: certificate, label: "Certificate on Completion" }
        ]}
      />
    </div>
  )
}

export default Home;