import { useLoaderData } from "@remix-run/react";
import React from "react";
import puppet from "~/krybogkravl/puppet.server";

const hejsen = "http://1000fryd.dk/";

export async function loader() {
  return puppet(hejsen);
}

export default function Kravl() {
  const data = useLoaderData<typeof loader>();

  return (
    <div>
      <h1>Kryb og Kravl</h1>
      <h2>links on {hejsen}</h2>
      <div className="flex col gap-2">
        {data.map((dat) => (
          <a key={JSON.stringify(dat)} href={dat.href}>
            {dat.title}
          </a>
        ))}
      </div>
    </div>
  );
}
