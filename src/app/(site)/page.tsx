import _ from "lodash";

import { Heading, Subheading } from "../../catalyst/heading";

import { sportsToFilterOut } from "../../config";

// import Swiper styles
import { Link } from "../../catalyst/link";
import { getSportsServer } from "@/lib/odds";
import { Metadata } from "next";

const Index = async () => {
  const sports = await getSportsServer();

  const groups = _.uniqBy(sports, "group")
    .filter((g) => g.group && !sportsToFilterOut.includes(g.group))
    .map((g) => g.group)
    .sort((a, b) => a!.localeCompare(b!)) as string[];

  return (
    <>
      <p className="my-4 lg:text-[100px] text-5xl">💩 ShitOdds</p>
      <Subheading className="my-4">
        Odds comparison, and EV compared to De-vigged Pinnacle. No ads.
      </Subheading>
      <div className="w-full pr-2 lg:w-3/4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {groups.map((group) => (
          <Link to={`/${group.toLowerCase().replace(/ /g, "-")}/`} key={group}>
            <div
              key={group}
              className="w-full py-10 px-2 border border-punt-300 rounded-md hover:shadow-lg text-left bg-white dark:bg-punt-900 dark:border-punt-700 flex flex-col items-center justify-center "
            >
              <p className="capitalize text-lg   text-center lg:text-xl">
                {group}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
};

export default Index;
