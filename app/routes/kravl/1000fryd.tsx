import { useLoaderData } from "@remix-run/react";
import React from "react";
import type { Koncert } from "~/krybogkravl/types";
import t000fryd from "~/krybogkravl/venues/1000fryd.server";

/* export async function loader() {
  return await t000fryd();
} */

export default function T000Fryd() {
  const data = useLoaderData<typeof loader>();

  return (
    <div>
      <h1>Chuck Norris Poke</h1>
      <div className="flex col gap-2">
        {data.map((month) => (
          <div key={month.month}>
            <KoncertListe events={month.events} />
          </div>
        ))}
      </div>
    </div>
  );
}

const KoncertListe: React.FC<{ events: Koncert[] }> = ({ events }) => {
  return (
    <>
      {events.map((event) => (
        <a key={JSON.stringify(event)} href={event.href}>
          <pre>{event.bands.join("\n")}</pre>
        </a>
      ))}
    </>
  );
};
