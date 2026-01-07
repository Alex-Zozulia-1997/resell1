'use client';
import { TITLE_TAILWIND_CLASS } from '@/utils/constants';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import countries from 'world-countries';

const ProjectsData = [
  {
    id: 1,
    name: 'USA',
    description: '6.5M+ ',
    image: './flags/usa.svg',
    imageDark: './flags/us.svg',
    url: '/sign-up',
  },
  {
    id: 2,
    name: 'France',
    description: '1.1M+',

    image: './flags/fr.svg',
    url: '/sign-up',
  },
  {
    id: 3,
    name: 'Germany',
    description: '900K+',

    image: './flags/de.svg',
    url: '/sign-up',
  },
  {
    id: 4,
    name: 'India',
    description: '2.5M+',

    image: './flags/in.svg',

    url: '/sign-up',
  },
  {
    id: 5,
    name: 'Brazil',
    description: '2.3M+ ',
    image: './flags/br.svg',
    url: '/sign-up',
  },
  {
    id: 6,
    name: 'Japan',
    description: '500K+',

    image: './flags/jp.svg',
    url: '/sign-up',
  },
  {
    id: 7,
    name: 'Ukraine',
    description: '500K+',

    image: './flags/ua.svg',
    url: '/sign-up',
  },
  {
    id: 8,
    name: 'Vietnam',
    description: '600K+',

    image: './flags/vn.svg',

    url: '/sign-up',
  },
];

const SpringAnimatedFeatures = () => {
  return (
    <div className="flex flex-col justify-center items-center lg:w-[75%]">
      <div className="flex flex-col mb-[3rem] text-center">
        <h2
          className={`${TITLE_TAILWIND_CLASS} mt-2 font-semibold tracking-tight dark:text-white text-gray-900`}>
          <span className="text-blue-600 text-5xl">16M+</span> Residential IPs
          in <span className="text-blue-600 text-5xl">183 </span> countries{' '}
        </h2>
        <p className="mx-auto max-w-[500px] text-gray-600 dark:text-gray-400 text-center mt-2 ">
          Collect data, check ads, and more with our geo-diverse residential
          proxies.
        </p>
      </div>
      <div className="grid w-full grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {ProjectsData.map((project) => {
          return (
            <motion.div
              whileHover={{
                y: -8,
              }}
              transition={{
                type: 'spring',
                bounce: 0.7,
              }}
              key={project.id}
              className="mt-5 text-left border border-2 p-6 rounded-md dark:bg-black flex flex-col items-center ">
              <Link
                href={project?.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center h-full w-full ">
                <div className=" h-20 w-32 bg-gray-00 mb-4">
                  <img
                    src={
                      project?.imageDark ? project?.imageDark : project.image
                    }
                    alt={project.name}
                    className="rounded-md w-full h-full object-cover "
                  />
                </div>
                <div className="mb-1 text-3xl text-center font- ">
                  {project.name}
                </div>
                <div className=" gap-2 flex max-w-[250px] text-xl text-center font-bold text-gray-600 dark:text-gray-400">
                  <p className="text-blue-600">{project.description}</p>{' '}
                  <p>IPs</p>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default SpringAnimatedFeatures;
