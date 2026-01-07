import OrbitingCircles from '@/components/magicui/orbiting-circles';
import { IconProps } from '@radix-ui/react-icons/dist/types';
import Image from 'next/image';

export function OrbitingCirclesComponent() {
  return (
    <div className="relative flex h-[500px] w-full max-w-[32rem] items-center justify-center overflow-hidden rounded-lg">
      <span className="pointer-events-none whitespace-pre-wrap bg-gradient-to-b from-black to-gray-500/80 bg-clip-text text-center text-8xl font-semibold leading-none text-transparent dark:from-white dark:to-slate-900/10">
        Open Web{' '}
      </span>

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
