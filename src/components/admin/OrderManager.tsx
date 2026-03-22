import React, { useState } from 'react';
import { ShoppingCart, X, User, Package, CreditCard } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

import { Order } from '../../types';

interface OrderManagerProps {
  orders: Order[];
}

const OrderManager: React.FC<OrderManagerProps> = ({ orders }) => {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-display font-bold text-brand-primary uppercase tracking-tighter">Manage Orders</h2>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left min-w-[800px]">
          <thead>
            <tr className="border-b border-brand-accent-secondary/10">
              <th className="pb-4 font-mono text-[10px] text-brand-accent uppercase tracking-widest">Order ID</th>
              <th className="pb-4 font-mono text-[10px] text-brand-accent uppercase tracking-widest">Customer</th>
              <th className="pb-4 font-mono text-[10px] text-brand-accent uppercase tracking-widest">Items</th>
              <th className="pb-4 font-mono text-[10px] text-brand-accent uppercase tracking-widest">Amount</th>
              <th className="pb-4 font-mono text-[10px] text-brand-accent uppercase tracking-widest">Status</th>
              <th className="pb-4 font-mono text-[10px] text-brand-accent uppercase tracking-widest">Date</th>
              <th className="pb-4 font-mono text-[10px] text-brand-accent uppercase tracking-widest text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-accent-secondary/5">
            {orders.map(order => (
              <tr key={order.id} className="group hover:bg-brand-accent/5 transition-colors">
                <td className="py-4 font-mono text-xs text-brand-primary">{order.id.slice(-8).toUpperCase()}</td>
                <td className="py-4">
                  <div className="text-brand-text font-bold text-sm">{order.deliveryInfo?.name || 'Anonymous'}</div>
                  <div className="text-[10px] text-brand-text/40 font-bold uppercase tracking-widest">{order.deliveryInfo?.phone}</div>
                </td>
                <td className="py-4">
                  <div className="text-brand-text text-xs">
                    {order.items?.length} {order.items?.length === 1 ? 'Item' : 'Items'}
                  </div>
                </td>
                <td className="py-4 text-brand-primary font-bold">₹{order.amount?.toLocaleString()}</td>
                <td className="py-4">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                    order.status === 'paid' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-orange-500/10 text-orange-500'
                  }`}>
                    {order.status}
                  </span>
                </td>
                <td className="py-4 text-brand-text/60 text-xs">
                  {order.createdAt?.seconds 
                    ? new Date(order.createdAt.seconds * 1000).toLocaleDateString()
                    : order.createdAt 
                      ? new Date(order.createdAt).toLocaleDateString()
                      : 'N/A'
                  }
                </td>
                <td className="py-4 text-right">
                  <button 
                    onClick={() => setSelectedOrder(order)}
                    className="px-4 py-2 bg-brand-accent/10 text-brand-accent rounded-xl font-bold uppercase text-[10px] tracking-widest hover:bg-brand-accent hover:text-brand-bg-secondary transition-all"
                  >
                    Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Order Details Modal */}
      <AnimatePresence>
        {selectedOrder && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 md:p-6">
            <div className="absolute inset-0 bg-brand-primary/60 backdrop-blur-md" onClick={() => setSelectedOrder(null)} />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative bg-brand-bg w-full max-w-3xl rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="p-8 border-b border-brand-accent-secondary/10 flex justify-between items-center bg-brand-bg-secondary/50">
                <h2 className="text-3xl font-display font-bold text-brand-primary uppercase tracking-tighter">
                  Order #{selectedOrder.id.slice(-8).toUpperCase()}
                </h2>
                <button onClick={() => setSelectedOrder(null)} className="p-2 hover:bg-brand-accent/10 rounded-full transition-colors">
                  <X className="w-6 h-6 text-brand-primary" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-8 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <h3 className="text-lg font-bold text-brand-primary uppercase tracking-tight flex items-center gap-2">
                      <User className="w-5 h-5 text-brand-accent" /> Customer Info
                    </h3>
                    <div className="space-y-2 text-sm">
                      <p><span className="text-brand-text/40 uppercase text-[10px] font-bold tracking-widest">Name:</span> {selectedOrder.deliveryInfo?.name}</p>
                      <p><span className="text-brand-text/40 uppercase text-[10px] font-bold tracking-widest">Email:</span> {selectedOrder.deliveryInfo?.email}</p>
                      <p><span className="text-brand-text/40 uppercase text-[10px] font-bold tracking-widest">Phone:</span> {selectedOrder.deliveryInfo?.phone}</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-lg font-bold text-brand-primary uppercase tracking-tight flex items-center gap-2">
                      <CreditCard className="w-5 h-5 text-brand-accent" /> Payment Info
                    </h3>
                    <div className="space-y-2 text-sm">
                      <p><span className="text-brand-text/40 uppercase text-[10px] font-bold tracking-widest">Status:</span> {selectedOrder.status}</p>
                      <p><span className="text-brand-text/40 uppercase text-[10px] font-bold tracking-widest">Amount:</span> ₹{selectedOrder.amount?.toLocaleString()}</p>
                      <p><span className="text-brand-text/40 uppercase text-[10px] font-bold tracking-widest">Order ID:</span> {selectedOrder.razorpay_order_id}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-brand-primary uppercase tracking-tight flex items-center gap-2">
                    <Package className="w-5 h-5 text-brand-accent" /> Order Items
                  </h3>
                  <div className="space-y-2">
                    {selectedOrder.items?.map((item: any, idx: number) => (
                      <div key={idx} className="flex justify-between p-3 bg-brand-bg-secondary rounded-xl text-sm">
                        <span>{item.name} x {item.quantity}</span>
                        <span className="font-bold">₹{(item.price * item.quantity).toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default OrderManager;
