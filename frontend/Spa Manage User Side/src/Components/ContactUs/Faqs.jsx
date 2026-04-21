import * as React from "react";
import { styled } from "@mui/material/styles";
import ArrowForwardIosSharpIcon from "@mui/icons-material/ArrowForwardIosSharp";
import MuiAccordion from "@mui/material/Accordion";
import MuiAccordionSummary from "@mui/material/AccordionSummary";
import MuiAccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import "./Faqs.css";

const Accordion = styled((props) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  "&:not(:last-child)": {
    borderBottom: 0,
  },
  "&::before": {
    display: "none",
  },
  borderTopLeftRadius: "0px",
  borderTopRightRadius: "0px",
  "&:nth-child(2)": {
    borderTopLeftRadius: "6px",
    borderTopRightRadius: "6px",
  },
  "&:last-child": {
    borderBottomLeftRadius: "6px",
    borderBottomRightRadius: "6px",
  },
}));

const AccordionSummary = styled((props) => (
  <MuiAccordionSummary
    expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: "0.9rem" }} />}
    {...props}
  />
))(({ theme }) => ({
  backgroundColor: "rgba(248, 248, 248, 0.5)",
  flexDirection: "row-reverse",
  "& .MuiAccordionSummary-expandIconWrapper.Mui-expanded": {
    transform: "rotate(90deg)",
  },
  "& .MuiAccordionSummary-content": {
    marginLeft: theme.spacing(1),
  },
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: theme.spacing(2),
  borderTop: "1px solid rgba(0, 0, 0, .125)",
}));

export default function FAQS() {
  const [expanded, setExpanded] = React.useState("panel1");

  const handleChange = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };

  return (
    <div className="vendor_faq_accordian">
      <div className="title_Acc">Frequently Asked Questions (FAQs)</div>

      <Accordion
        expanded={expanded === "panel1"}
        onChange={handleChange("panel1")}
      >
        <AccordionSummary aria-controls="panel1d-content" id="panel1d-header">
          <Typography>
            What is the best online platform to book my salon appointment?
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            <div
              style={{
                paddingLeft: "10px",
              }}
            >
              <p>
                When it comes to booking your salon appointments seamlessly and
                experiencing the epitome of convenience, <strong>Trakky</strong>{" "}
                takes the crown!
                <strong> Trakky</strong> isn't just a booking platform; it's
                your personalized gateway to the best salons in India.
              </p>
              <br />
              <p>
                Our user-friendly platform ensures a seamless experience, giving
                you the power to schedule your grooming sessions with ease. With{" "}
                <strong>Trakky</strong>, you're not limited by location. Our
                platform brings famous salon brands to you in popular cities
                across India – Ahmedabad, Bangalore, Gandhinagar, Mumbai, and
                Delhi. Wherever you are, <strong>Trakky</strong> ensures you
                have access to the top beauty destinations.
              </p>
              <br />
              <p>
                If that’s not enough! <strong>Trakky</strong> goes beyond just
                booking – we bring you exclusive offers and exciting deals from
                the finest salons. And, we continuously strive to bring you
                innovative beauty solutions, ensuring you stay ahead of the
                curve when it comes to the latest trends and techniques in the
                world of grooming.
              </p>
            </div>
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion
        expanded={expanded === "panel2"}
        onChange={handleChange("panel2")}
      >
        <AccordionSummary aria-controls="panel2d-content" id="panel2d-header">
          <Typography>Why are salon services important?</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            <div
              style={{
                paddingLeft: "10px",
              }}
            >
              <p>
                Salon services offer a range of benefits beyond just the
                immediate aesthetic improvements. Here are some reasons why they
                can be important:
              </p>
              <br />
              <ul className="vendor_faq_spa_ul_li">
                <li className="vendor_faq_spa_li">
                  <strong>Personal grooming and hygiene:</strong> Expert care:
                  Services like haircuts, waxing, manicures, and pedicures
                  require special skills and tools that professionals at salons
                  have mastered. Attempting these at home can lead to uneven
                  results or even harm.
                </li>
                <li className="vendor_faq_spa_li">
                  <strong>Maintaining good hygiene:</strong> Regular salon
                  visits can help with keeping nails clean and trimmed, reducing
                  the risk of infections, and ensuring proper hair care to
                  prevent scalp issues.
                </li>
                <li className="vendor_faq_spa_li">
                  <strong>Boosting confidence and self-esteem:</strong> Looking
                  your best: A fresh haircut, a glowing facial, or a new
                  hairstyle can significantly boost your confidence and
                  self-esteem. Feeling good about your appearance can positively
                  impact various aspects of your life, from social interactions
                  to professional settings.
                </li>
                <li className="vendor_faq_spa_li">
                  <strong>Expressing yourself:</strong> Salons offer a variety
                  of services that allow you to personalize your look and
                  experiment with different styles. This can be a fun way to
                  express your individuality and feel more confident in your own
                  skin.
                </li>
                <li className="vendor_faq_spa_li">
                  <strong>Relaxation and stress relief:</strong> Pampering
                  yourself: Salon visits can be a form of self-care, providing
                  much-needed relaxation and stress relief. Massages, facials,
                  and other treatments can help you unwind and de-stress,
                  leaving you feeling refreshed and rejuvenated.
                </li>
                <li className="vendor_faq_spa_li">
                  <strong>Expert advice:</strong> Hairstylists, estheticians,
                  and other salon professionals can offer valuable advice on
                  caring for your hair, skin, and nails. This can help you
                  maintain a healthy appearance and develop a personalized
                  routine for optimal results.
                </li>
                <li className="vendor_faq_spa_li">
                  <strong>Social aspect and community:</strong> Building
                  relationships: Salons can be a place to connect with others,
                  chat with stylists, and build relationships. This can be
                  especially beneficial for individuals who may feel isolated or
                  lonely.
                </li>
                <li className="vendor_faq_spa_li">
                  <strong>Cultural significance:</strong> Salons often play a
                  role in cultural practices and traditions related to grooming
                  and appearance. They can offer a space for celebrating these
                  traditions and connecting with your community.
                </li>
              </ul>
              <br />
              <p>
                Ultimately, the importance of salon services is subjective and
                varies from person to person. However, they can offer a variety
                of benefits that extend beyond just physical appearance,
                impacting your confidence, self-esteem, stress levels, and
                social connections. It's also important to consider your
                individual needs and preferences when deciding whether a
                particular salon is right for you. That’s where{" "}
                <strong>Trakky</strong> comes into play to help you choose the
                best place for you from among the top salon brands in India.
              </p>
            </div>
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion
        expanded={expanded === "panel3"}
        onChange={handleChange("panel3")}
      >
        <AccordionSummary aria-controls="panel3d-content" id="panel3d-header">
          <Typography>How to grow the salon business in India?</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
          <div>
                    <p>
                        Growing a salon business in India involves a combination of
                        strategic planning, effective marketing, and providing exceptional
                        services. Trakky understands the challenges faced by salon owners
                        and has tailored solutions to address these needs.
                    </p>
                    <br />
                    <ul>
                        <li>
                            <strong>Online Presence:</strong> Salon owners need to establish a
                            strong online presence to reach a wider audience. Trakky's
                            platform helps salons showcase their services to a vast customer
                            base, increasing visibility and attracting potential clients.
                        </li>
                        <li>
                            <strong>Marketing Strategies:</strong> Implementing targeted
                            marketing strategies is crucial. Trakky offers marketing support
                            to our deserving partnered salons, helping them reach their target
                            market effectively through various channels.
                        </li>
                        <li>
                            <strong>Customer Engagement:</strong> Building and maintaining a
                            loyal customer base is key to sustained growth. Trakky facilitates
                            seamless customer engagement, ensuring a positive experience that
                            encourages repeat business.
                        </li>
                        <li>
                            <strong>Optimized Booking System:</strong> Salon businesses can
                            enhance operational efficiency with Trakky's booking system.
                            Simplifying the booking process for customers and streamlining
                            salon operations leads to increased profitability.
                        </li>
                        <li>
                            <strong>Promotional Opportunities:</strong> Trakky provides salons
                            with promotional opportunities, helping them stand out in a
                            competitive market. Special promotions and deals can attract new
                            customers and retain existing ones.
                        </li>
                    </ul>
                    <br />
                    <p>
                        By partnering with <strong>Trakky</strong>, salons can leverage our
                        platform to implement these strategies efficiently, resulting in
                        sustainable growth and increased profitability. Always keep in mind
                        that each salon is unique, and our tailored solutions aim to address
                        individual needs, ensuring a personalized approach to business
                        growth.
                    </p>
                </div>
          </Typography>
        </AccordionDetails>
      </Accordion>
    </div>
  );
}
