'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useStore, Order } from '@/store/useStore';
import { Package, Clock, CheckCircle, Store, UserCheck, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BRANCHES } from '@/components/BranchSelector';
import { Input } from '@/components/ui/input';
import { useUser } from '@clerk/nextjs';

const STAFF_MEMBERS = ['Alice M.', 'Bob K.', 'Claude R.', 'David N.'];

export default function BranchDashboard() {
  const { t, i18n } = useTranslation();
  const { orders, updateOrderStatus, branchInventory, isEvaluationMode, addOrder } = useStore();
  const { user } = useUser();
  const [selectedBranch, setSelectedBranch] = useState<string>('All');
  const [view, setView] = useState<'orders' | 'inventory'>('orders');
  
  const isAdminUser = user?.emailAddresses?.some(e => e.emailAddress === 'admin@test.com') ||
    user?.publicMetadata?.role === 'manager';
  const shouldSeedOrders = isEvaluationMode || isAdminUser;
  
  // Seed dummy orders for evaluation mode or admin user if empty
  useEffect(() => {
    if (shouldSeedOrders && orders.length === 0) {
      const mockOrders: Order[] = [
        {
          id: 'SMB-4829',
          date: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
          total: 12500,
          deposit: 500,
          items: [{ id: 'prod-001', name: 'Inyange Milk', price: 1200, quantity: 2, category: 'Dairy', description: '', imageUrl: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400', inStock: true }],
          status: 'Processing',
          branch: 'Remera',
          branchId: 'remera',
          pickupTime: '18:30',
          customerName: 'Jean Luc',
          customerPhone: '0780000111'
        },
        {
          id: 'SMB-5102',
          date: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
          total: 8200,
          deposit: 500,
          items: [{ id: 'prod-002', name: 'Coffee', price: 8500, quantity: 1, category: 'Beverages', description: '', imageUrl: 'https://images.unsplash.com/photo-1559525839-b184a4d698c7?w=400', inStock: true }],
          status: 'Assigned',
          branch: 'Kimironko',
          branchId: 'kimironko',
          pickupTime: '19:00',
          customerName: 'Marie Claire',
          customerPhone: '0780000222',
          assignedTo: 'Alice M.'
        },
        {
          id: 'SMB-3944',
          date: new Date(Date.now() - 1000 * 60 * 300).toISOString(),
          total: 4500,
          deposit: 500,
          items: [{ id: 'prod-005', name: 'Flour', price: 4200, quantity: 1, category: 'Pantry', description: '', imageUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400', inStock: true }],
          status: 'Ready for Pick-Up',
          branch: 'Remera',
          branchId: 'remera',
          pickupTime: '17:45',
          customerName: 'Thierry H.',
          customerPhone: '0780000333',
          assignedTo: 'Bob K.'
        }
      ];
      mockOrders.forEach(o => addOrder(o));
    }
  }, [isEvaluationMode, orders.length, addOrder]);
  
  const filteredOrders = orders.filter(
    (o) => selectedBranch === 'All' || o.branchId === selectedBranch
  );

  return (
    <div className="container mx-auto px-4 py-8 lg:max-w-6xl">
      <div className="flex items-center gap-3 mb-8 pb-4 border-b">
        <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
          <Shield className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">{t('dashboardTitle', { defaultValue: 'Branch Dashboard' })}</h1>
          <p className="text-muted-foreground">{t('dashboardSubtitle', { defaultValue: 'Manage orders, assign staff, and track pick-ups.' })}</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <aside className="w-full md:w-64 shrink-0 space-y-6">
          <div className="bg-card border rounded-xl p-5 shadow-sm">
            <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground mb-4 flex items-center gap-2">
              <Store className="w-4 h-4" />
              {t('filterByBranch', { defaultValue: 'Filter by Branch' })}
            </h3>
            <div className="space-y-1">
              <button
                onClick={() => setSelectedBranch('All')}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                  selectedBranch === 'All'
                    ? 'bg-primary/10 text-primary font-medium'
                    : 'hover:bg-muted text-muted-foreground hover:text-foreground'
                }`}
              >
                {t('all')}
              </button>
              {BRANCHES.map((branch) => (
                <button
                  key={branch.id}
                  onClick={() => setSelectedBranch(branch.id)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                    selectedBranch === branch.id
                      ? 'bg-primary/10 text-primary font-medium'
                      : 'hover:bg-muted text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {branch.name}
                </button>
              ))}
            </div>
          </div>
          
          <div className="bg-card border rounded-xl p-5 shadow-sm">
            <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground mb-4">
              {t('navigation', { defaultValue: 'Navigation' })}
            </h3>
            <div className="space-y-1">
              <button
                onClick={() => setView('orders')}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center gap-2 ${
                  view === 'orders' ? 'bg-primary text-white font-bold' : 'hover:bg-muted text-muted-foreground'
                }`}
              >
                <Package className="w-4 h-4" />
                {t('activeOrders', { defaultValue: 'Active Orders' })}
              </button>
              <button
                onClick={() => setView('inventory')}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center gap-2 ${
                  view === 'inventory' ? 'bg-primary text-white font-bold' : 'hover:bg-muted text-muted-foreground'
                }`}
              >
                <Store className="w-4 h-4" />
                {t('inventory', { defaultValue: 'Inventory' })}
              </button>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          {view === 'orders' ? (
            <div className="bg-card border rounded-xl shadow-sm overflow-hidden">
              <div className="p-5 border-b bg-muted/20 flex items-center justify-between">
                <h2 className="font-bold text-lg flex items-center gap-2">
                  <Package className="w-5 h-5 text-primary" />
                  {t('activeOrders', { defaultValue: 'Active Orders' })}
                </h2>
                <span className="text-sm font-medium bg-primary/10 text-primary px-3 py-1 rounded-full">
                  {t('orderCount', { count: filteredOrders.length })}
                </span>
              </div>

              {filteredOrders.length === 0 ? (
                <div className="p-12 text-center text-muted-foreground">
                  <p>{t('noOrdersBranch', { defaultValue: 'No orders found for this branch.' })}</p>
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
                              {t(`status${order.status.replace(/ /g, '')}`, { defaultValue: order.status })}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {new Date(order.date).toLocaleString(i18n.language === 'en' ? 'en-US' : i18n.language === 'fr' ? 'fr-FR' : 'rw-RW')} • {t('brandName')} {order.branch}
                          </p>
                          <p className="text-sm font-medium mt-2">
                            {t('customer', { defaultValue: 'Customer' })}: <span className="text-muted-foreground">{order.customerName} ({order.customerPhone})</span>
                          </p>
                          <p className="text-sm font-medium">
                            {t('pickupTime', { defaultValue: 'Pick-Up Time' })}: <span className="text-muted-foreground">{order.pickupTime}</span>
                          </p>
                        </div>

                        {/* Actions */}
                        <div className="min-w-[240px] space-y-3 bg-muted/20 p-4 rounded-xl border">
                          <p className="text-sm font-semibold mb-2 flex items-center gap-1.5">
                            <UserCheck className="w-4 h-4 text-primary" />
                            {t('assignStaff', { defaultValue: 'Assign Staff' })}
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
                            <option value="" disabled>{t('selectStaff', { defaultValue: 'Select staff...' })}</option>
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
                              {t('ready', { defaultValue: 'Ready' })}
                            </Button>
                            <Button 
                              size="sm"
                              variant={order.status === 'Completed' ? 'default' : 'outline'}
                              className="flex-1 text-xs"
                              onClick={() => updateOrderStatus(order.id, 'Completed')}
                            >
                              <CheckCircle className="w-3 h-3 mr-1" /> {t('finish', { defaultValue: 'Finish' })}
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            /* Inventory View */
            <div className="bg-card border rounded-xl shadow-sm overflow-hidden">
              <div className="p-5 border-b bg-muted/20 flex items-center justify-between">
                <h2 className="font-bold text-lg flex items-center gap-2">
                  <Store className="w-5 h-5 text-primary" />
                  {t('inventoryStatus', { defaultValue: 'Live Inventory Status' })}
                </h2>
                <span className="text-sm font-medium text-muted-foreground italic">
                  {selectedBranch === 'All' 
                    ? t('selectBranchToSeeStock', { defaultValue: 'Select a single branch to view stock' }) 
                    : BRANCHES.find(b => b.id === selectedBranch)?.name}
                </span>
              </div>

              {selectedBranch === 'All' ? (
                <div className="p-16 text-center text-muted-foreground">
                  <Store className="w-12 h-12 mx-auto mb-4 opacity-20" />
                  <p>{t('inventorySelectPrompt', { defaultValue: 'Please select a specific branch from the left sidebar to manage its inventory.' })}</p>
                </div>
              ) : (
                <div className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                      <thead className="bg-muted/50 text-xs uppercase font-bold text-muted-foreground border-b text-center">
                        <tr>
                          <th className="px-6 py-4 text-left">{t('product', { defaultValue: 'Product' })}</th>
                          <th className="px-6 py-4">{t('stockLevel', { defaultValue: 'Stock Level' })}</th>
                          <th className="px-6 py-4">{t('status', { defaultValue: 'Status' })}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y text-center">
                        {Object.keys(t('products', { returnObjects: true })).map((prodId) => {
                          const branchId = selectedBranch === 'All' ? '' : selectedBranch;
                          const stock = branchInventory[branchId]?.[prodId] ?? 50; // Mock default 50 if no movement
                          
                          return (
                            <tr key={prodId} className="hover:bg-muted/30 transition-colors">
                              <td className="px-6 py-4 text-left font-medium">
                                {t(`products.${prodId}.name`, { defaultValue: prodId })}
                              </td>
                              <td className="px-6 py-4">
                                <span className={`px-3 py-1 rounded-full font-black ${stock < 10 ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                                  {stock}
                                </span>
                              </td>
                              <td className="px-6 py-4 uppercase text-[10px] font-bold">
                                {stock === 0 ? (
                                  <span className="text-red-600">{t('outOfStock')}</span>
                                ) : stock < 10 ? (
                                  <span className="text-amber-500 animate-pulse">{t('lowStock', { defaultValue: 'LOW STOCK' })}</span>
                                ) : (
                                  <span className="text-green-600">{t('inStock', { defaultValue: 'IN STOCK' })}</span>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                        {Object.keys(t('products', { returnObjects: true })).length === 0 && (
                          <tr>
                            <td colSpan={3} className="px-6 py-12 text-muted-foreground italic bg-muted/10">
                              {t('noProductsFound', { defaultValue: 'No products found in the catalog.' })}
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
