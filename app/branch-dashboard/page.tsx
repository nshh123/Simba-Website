'use client';

import { useState } from 'react';
import { useStore } from '@/store/useStore';
import { Package, Clock, CheckCircle, Store, UserCheck, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const STAFF_MEMBERS = ['Alice M.', 'Bob K.', 'Claude R.', 'David N.'];

export default function BranchDashboard() {
  const { orders, updateOrderStatus, branchInventory } = useStore();
  const [selectedBranch, setSelectedBranch] = useState<string>('All');
  
  const branches = ['All', ...Array.from(new Set(orders.map((o) => o.branch)))];
  
  const filteredOrders = orders.filter(
    (o) => selectedBranch === 'All' || o.branch === selectedBranch
  );

  return (
    <div className="container mx-auto px-4 py-8 lg:max-w-6xl">
      <div className="flex items-center gap-3 mb-8 pb-4 border-b">
        <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
          <Shield className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">Branch Dashboard</h1>
          <p className="text-muted-foreground">Manage orders, assign staff, and track pick-ups.</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <aside className="w-full md:w-64 shrink-0 space-y-6">
          <div className="bg-card border rounded-xl p-5 shadow-sm">
            <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground mb-4 flex items-center gap-2">
              <Store className="w-4 h-4" />
              Filter by Branch
            </h3>
            <div className="space-y-1">
              {branches.map((branch) => (
                <button
                  key={branch}
                  onClick={() => setSelectedBranch(branch)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                    selectedBranch === branch
                      ? 'bg-primary/10 text-primary font-medium'
                      : 'hover:bg-muted text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {branch}
                </button>
              ))}
            </div>
          </div>
          
          <div className="bg-card border rounded-xl p-5 shadow-sm">
            <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground mb-4">
              Inventory Alerts
            </h3>
            <div className="text-xs text-muted-foreground">
              {Object.keys(branchInventory).length > 0 ? (
                <p>Tracked per branch. Check system for low stock alerts.</p>
              ) : (
                <p>No inventory movements yet.</p>
              )}
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          <div className="bg-card border rounded-xl shadow-sm overflow-hidden">
            <div className="p-5 border-b bg-muted/20 flex items-center justify-between">
              <h2 className="font-bold text-lg flex items-center gap-2">
                <Package className="w-5 h-5 text-primary" />
                Active Orders
              </h2>
              <span className="text-sm font-medium bg-primary/10 text-primary px-3 py-1 rounded-full">
                {filteredOrders.length} Total
              </span>
            </div>

            {filteredOrders.length === 0 ? (
              <div className="p-12 text-center text-muted-foreground">
                <p>No orders found for this branch.</p>
              </div>
            ) : (
              <div className="divide-y max-h-[800px] overflow-auto hide-scrollbar">
                {filteredOrders.map((order) => (
                  <div key={order.id} className="p-5 hover:bg-muted/10 transition-colors">
                    <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                      {/* Order Info */}
                      <div className="space-y-1">
                        <div className="flex items-center gap-3">
                          <p className="font-bold text-lg">{order.id}</p>
                          <span className={`text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${
                            order.status === 'Completed' ? 'bg-green-100 text-green-700' : 
                            order.status === 'Assigned' ? 'bg-blue-100 text-blue-700' :
                            'bg-amber-100 text-amber-700'
                          }`}>
                            {order.status}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {new Date(order.date).toLocaleString()} • {order.branch}
                        </p>
                        <p className="text-sm font-medium mt-2">
                          Customer: <span className="text-muted-foreground">{order.customerName} ({order.customerPhone})</span>
                        </p>
                        <p className="text-sm font-medium">
                          Pick-Up Time: <span className="text-muted-foreground">{order.pickupTime}</span>
                        </p>
                      </div>

                      {/* Actions */}
                      <div className="min-w-[240px] space-y-3 bg-muted/20 p-4 rounded-xl border">
                        <p className="text-sm font-semibold mb-2 flex items-center gap-1.5">
                          <UserCheck className="w-4 h-4 text-primary" />
                          Assign Staff
                        </p>
                        <select
                          className="w-full text-sm h-9 rounded-md border border-input bg-background px-3 py-1 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                          value={order.assignedTo || ''}
                          onChange={(e) => {
                            if (e.target.value) {
                              updateOrderStatus(order.id, 'Assigned', e.target.value);
                            }
                          }}
                          disabled={order.status === 'Completed'}
                        >
                          <option value="" disabled>Select staff...</option>
                          {STAFF_MEMBERS.map(staff => (
                            <option key={staff} value={staff}>{staff}</option>
                          ))}
                        </select>

                        <div className="flex gap-2 mt-3 pt-3 border-t">
                          <Button 
                            size="sm" 
                            variant={order.status === 'Ready for Pick-Up' ? 'default' : 'outline'}
                            className="flex-1 text-xs"
                            disabled={order.status === 'Completed'}
                            onClick={() => updateOrderStatus(order.id, 'Ready for Pick-Up')}
                          >
                            Ready
                          </Button>
                          <Button 
                            size="sm"
                            variant={order.status === 'Completed' ? 'default' : 'outline'}
                            className="flex-1 text-xs"
                            onClick={() => updateOrderStatus(order.id, 'Completed')}
                          >
                            <CheckCircle className="w-3 h-3 mr-1" /> Finish
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
