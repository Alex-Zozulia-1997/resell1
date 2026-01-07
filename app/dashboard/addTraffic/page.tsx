'use client';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import PurchaseCard from '../_components/purchase-card';
const offerings = [
  { price: 10, data: 3 },
  { price: 20, data: 5 },
  { price: 30, data: 10 },
  { price: 30, data: 10 },
];
export default function Category() {
  return (
    <main className="flex w-full p-4 flex-col items-center justify-between h-full">
      <div className="text-3xl lg:text-5xl font-bold  w-full text-center py-2">
        <h1>Get More Traffic</h1>
      </div>
      {/* <div className="text-1xl pb-1">Add traffic</div> */}
      <div className="w-full flex flex- gap-4  justify-center grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 p-">
        {offerings.map((offering, index) => (
          <PurchaseCard key={offering.price} {...offering} />
        ))}
      </div>
    </main>
  );
}
