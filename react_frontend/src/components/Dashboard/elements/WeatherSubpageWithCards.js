import React, { useState, useEffect } from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import cloudsImage from "../../../assets/sky-with-clouds.jpg";

const WeatherSubpage = () => {
  // set up for the gauge, delete later
  const currentValue = 20;

  return (
    // first row - weather station header
    <div>
      <div className="row" style={{ flex: "1 1 auto" }}>
        <div className="col-12 d-flex p-2">
          <div
            className="fs-1 text-center p-3"
            style={{
              flex: "1 1 auto",
              maxHeight: "30vh",
              borderRadius: "0px",
              backgroundColor: "rgba(75, 192, 192, 0.2)",
              borderStyle: "solid",
              borderWidth: "1px",
              borderColor: "silver",
              // backgroundImage: `url(${cloudsImage})`, // Set the background image
            }}
          >
            Aktuelle Wetterlage - Wetterstation Lichtenberg:
          </div>
        </div>
      </div>
      {/* second row */}

      <div className="row mb-4">
        <div className="col-6 col-sm-4 col-md-3">
          <Card className="rounded-0" sx={{ maxWidth: 345 }}>
            <CardMedia
              sx={{ height: 70 }}
              image={cloudsImage}
              title="Temperatur"
            />
            <CardContent>
              <Typography  variant="h5" component="div">
                Temperatur
              </Typography>
              <Typography variant="body2" color="text.secondary">
                23 C
              </Typography>
            </CardContent>
          </Card>
        </div>
        <div className="col-6 col-sm-4 col-md-3">
          <Card className="rounded-0" sx={{ maxWidth: 345 }}>
            <CardMedia
              sx={{ height: 70 }}
              image={cloudsImage}
              title="Niederschlag"
            />
            <CardContent>
              <Typography variant="h5" component="div">
                Niederschlag
              </Typography>
              <Typography variant="body2" color="text.secondary">
                2.5 mm/h
              </Typography>
            </CardContent>
          </Card>
        </div>
        <div className="col-6 col-sm-4 col-md-3">
          <Card className="rounded-0" sx={{ maxWidth: 345 }}>
            <CardMedia
              sx={{ height: 70 }}
              image={cloudsImage}
              title="Temperatur"
            />
            <CardContent>
              <Typography  variant="h5" component="div">
                Temperatur
              </Typography>
              <Typography variant="body2" color="text.secondary">
                23 C
              </Typography>
            </CardContent>
          </Card>
        </div>
        <div className="col-6 col-sm-4 col-md-3">
          <Card className="rounded-0" sx={{ maxWidth: 345 }}>
            <CardMedia
              sx={{ height: 70 }}
              image={cloudsImage}
              title="Niederschlag"
            />
            <CardContent>
              <Typography variant="h5" component="div">
                Niederschlag
              </Typography>
              <Typography variant="body2" color="text.secondary">
                2.5 mm/h
              </Typography>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default WeatherSubpage;
