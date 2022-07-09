import { useMemo } from "react";
import { GoogleMap, useLoadScript, Marker } from "@react-google-maps/api";
import react, { useEffect, useState } from "react";
import { remarksToColours } from "../data/remarks-to-colours";

export default function Maps({ coordinates, setSideInfo }) {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_KEY,
  });

  if (!isLoaded) return <div>Loading...</div>;
  return <Map coordinates={coordinates} setSideInfo={setSideInfo} />;
}

function Map({ coordinates, setSideInfo }) {
  const center =
    coordinates.length > 0
      ? {
          lat: parseFloat(coordinates[0].properties.Lat),
          lng: parseFloat(coordinates[0].properties.Lon),
        }
      : { lat: 1.3521, lng: 103.8198 };

  const [centerState, setCenterState] = useState(center);

  useEffect(() => {
    setCenterState(center);
  }, [coordinates]);

  console.log("center", center);
  const zoom = coordinates && coordinates.length > 0 ? 15 : 12;

  return (
    <GoogleMap
      zoom={zoom}
      center={centerState}
      mapContainerClassName="map-container"
    >
      <Marker position={center} />
      {coordinates?.map((coordinate) => {
        return (
          <Marker
            icon={`/${remarksToColours[coordinate.properties.Remarks]}.png`}
            key={coordinate.properties.ID}
            onClick={() =>
              setSideInfo({
                servicePointName: coordinate.properties.Name,
                collectionType: coordinate.properties.Collection_Type,
                location: coordinate.properties.Location,
                postalCode: coordinate.properties.Postal_Code,
                remarks: coordinate.properties.Remarks,
                website: coordinate.properties.Website,
                directions: coordinate.properties.Directions,
              })
            }
            position={{
              lat: parseFloat(coordinate.properties.Lat),
              lng: parseFloat(coordinate.properties.Lon),
            }}
          />
        );
      })}
    </GoogleMap>
  );
}
