import React, {
  useEffect,
  useState,
  useContext,
} from "react";

import "./FlashSale.css";

import {
  ProductContext,
} from "../../context/ProductContext";

import {
  Link,
} from "react-router-dom";

const FlashSale = () => {

  /* PRODUCT CONTEXT */

  const {
    products,
  } = useContext(ProductContext);

  /* TIMER */

  const [timeLeft,
    setTimeLeft,
  ] = useState({

    hours: 2,

    minutes: 15,

    seconds: 44,
  });

  /* COUNTDOWN */

  useEffect(() => {

    const timer =
      setInterval(() => {

        setTimeLeft((prev) => {

          let {
            hours,
            minutes,
            seconds,
          } = prev;

          if (seconds > 0) {

            seconds--;
          }

          else {

            if (minutes > 0) {

              minutes--;

              seconds = 59;
            }

            else if (hours > 0) {

              hours--;

              minutes = 59;

              seconds = 59;
            }
          }

          return {
            hours,
            minutes,
            seconds,
          };
        });

      }, 1000);

    return () =>
      clearInterval(timer);

  }, []);

  return (

    <section className="flash-sale">

      {/* HEADER */}

      <div className="flash-header">

        <div>

          <h2>

            ⚡ Flash Sale

          </h2>

          <p>

            Limited Time Deals

          </p>

        </div>

        {/* TIMER */}

        <div className="flash-timer">

          <span>

            {String(
              timeLeft.hours
            ).padStart(2, "0")}

          </span>

          :

          <span>

            {String(
              timeLeft.minutes
            ).padStart(2, "0")}

          </span>

          :

          <span>

            {String(
              timeLeft.seconds
            ).padStart(2, "0")}

          </span>

        </div>

      </div>

      {/* PRODUCTS */}

      <div className="flash-grid">

        {products
          .slice(0, 4)
          .map((item) => (

            <Link
              to={`/product/${item.id}`}
              className="flash-link"
              key={item.id}
            >

              <div className="flash-card">

                {/* IMAGE */}

                <div className="flash-image">

                  <img
                    src={item.image}
                    alt={item.title}
                  />

                  <span className="flash-badge">

                    HOT

                  </span>

                </div>

                {/* CONTENT */}

                <div className="flash-content">

                  <h3>

                    {item.title}

                  </h3>

                  <div className="flash-price">

                    <span className="flash-new">

                      {item.price}

                    </span>

                    <span className="flash-old">

                      {item.oldPrice}

                    </span>

                  </div>

                </div>

              </div>

            </Link>
          ))}

      </div>

    </section>
  );
};

export default FlashSale;