import OrbitingCircles from '@/components/magicui/orbiting-circles';
import { IconProps } from '@radix-ui/react-icons/dist/types';
import Image from 'next/image';

export function OrbitingCirclesComponent() {
  return (
    <div className="relative flex h-[500px] w-full max-w-[32rem] items-center justify-center overflow-hidden rounded-lg">
      <div className="flex items-center justify-center w-auto bg-gray-200 dark:bg-gray-800 rounded-2xl pl-4 pr-2 py-2">
        <span className="text-6xl font-bold text-gray-100 bg-gray-900 dark:bg-white dark:text-gray-900 rounded pl-2 pr-1 tracking-widest">
          IP
        </span>
        <span className="text-6xl font-bold text-gray-800 dark:text-gray-200 pl-1">
          den
        </span>
      </div>

      {/* Inner Circles */}
      <OrbitingCircles
        className="h-[30px] w-[30px] border-none bg-transparent"
        duration={20}
        delay={20}
        radius={80}>
        <Icons.typescript />
      </OrbitingCircles>
      <OrbitingCircles
        className="h-[30px] w-[30px] border-none bg-transparent"
        duration={20}
        delay={10}
        radius={80}>
        <Icons.tailwind />
      </OrbitingCircles>
      <OrbitingCircles
        className="h-[30px] w-[30px] border-none bg-transparent"
        duration={15}
        delay={30}
        radius={80}>
        <Icons.playwright />
      </OrbitingCircles>

      {/* Outer Circles (reverse) */}
      <OrbitingCircles
        className="h-[50px] w-[50px] border-none bg-transparent"
        reverse
        radius={190}
        duration={20}>
        <Icons.nextjs />
      </OrbitingCircles>
      <OrbitingCircles
        className="h-[50px] w-[50px] border-none bg-transparent"
        radius={190}
        duration={20}
        delay={60}>
        <Icons.puppeteer />
      </OrbitingCircles>
      <OrbitingCircles
        className="h-[50px] w-[50px] border-none bg-transparent"
        reverse
        radius={190}
        duration={20}
        delay={40}>
        <Icons.supabase />
      </OrbitingCircles>
      <OrbitingCircles
        className="h-[50px] w-[50px] border-none bg-transparent"
        reverse
        radius={190}
        duration={10}
        delay={20}>
        <Icons.spy />
      </OrbitingCircles>
    </div>
  );
}

const Icons = {
  supabase: (props: IconProps) => (
    <Image src="/supabase.svg" alt="supa" width={100} height={100} />
  ),
  typescript: (props: IconProps) => (
    <Image src="/javascript.svg" alt="" width={100} height={100} />
  ),
  puppeteer: (props: IconProps) => (
    <Image src="/puppeteer.svg" alt="" width={100} height={100}></Image>
  ),
  tailwind: (props: IconProps) => (
    <Image
      src="/globe.svg"
      alt=""
      width={150}
      height={150}
      // className="bg-black p-2 rounded"
    />
  ),
  playwright: (props: IconProps) => (
    <Image
      src="/playwright.svg"
      alt=""
      width={150}
      height={150}
      // className="bg-black p-2 rounded"
    />
  ),
  spy: (props: IconProps) => (
    <Image src="/spy.svg" alt="" width={100} height={100} />
  ),

  nextjs: (props: IconProps) => (
    <Image src="/pythonBig.svg" alt="" width={100} height={100} />
  ),
};
