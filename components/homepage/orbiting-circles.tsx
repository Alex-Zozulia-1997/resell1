import OrbitingCircles from '@/components/magicui/orbiting-circles';
import { IconProps } from '@radix-ui/react-icons/dist/types';
import Image from 'next/image';
import Logo from '@/components/Logo';

export function OrbitingCirclesComponent() {
  return (
    <div className="relative flex h-[500px] w-full max-w-[32rem] items-center justify-center overflow-hidden rounded-lg">
      <div className="relative w-48 h-20 flex items-center justify-center">
        <Image
          src="/IPLogo.svg"
          alt="IPden Logo"
          width={192}
          height={80}
          className="object-contain"
          priority
        />
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
