"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Search, Filter, Eye, Edit, Package, AlertTriangle, CheckCircle, XCircle, Calendar } from "lucide-react"
import api from "@/lib/api"

// Add a Product type for better type safety
interface Product {
  id: number;
  name: string;
  sku: string;
  category: string | { name: string };
  stock: number;
  unit: string;
  reorderLevel: number;
  status: string;
  supplier?: string;
  lastUpdated?: string;
  priceTiers: { quantity: string; price: number }[];
  batches: { batch: string; quantity: number; expiry?: string | null; received: string }[];
}

export function Inventory() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)

  useEffect(() => {
    setLoading(true)
    api.get("/products")
      .then(res => {
        const safeProducts = (res.data.data || []).map((p: any) => ({
          ...p,
          priceTiers: Array.isArray(p.priceTiers) ? p.priceTiers : [],
          batches: Array.isArray(p.batches) ? p.batches : [],
          category: typeof p.category === 'string' ? p.category : (p.category?.name || 'N/A'),
        }))
        setProducts(safeProducts)
        setError(null)
      })
      .catch(err => {
        setError(err.response?.data?.message || err.message)
        setProducts([])
      })
      .finally(() => setLoading(false))
  }, [])

  const getStatusBadge = (status: string, stock: number, reorderLevel: number) => {
    if (stock === 0) {
      return (
        <Badge variant="destructive" className="flex items-center gap-1">
          <XCircle className="h-3 w-3" />
          Out of Stock
        </Badge>
      )
    } else if (stock <= reorderLevel) {
      return (
        <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200 flex items-center gap-1">
          <AlertTriangle className="h-3 w-3" />
          Low Stock
        </Badge>
      )
    } else {
      return (
        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 flex items-center gap-1">
          <CheckCircle className="h-3 w-3" />
          In Stock
        </Badge>
      )
    }
  }

  const getExpiryBadge = (expiry: string | null) => {
    if (!expiry) return null

    const expiryDate = new Date(expiry)
    const today = new Date()
    const daysUntilExpiry = Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

    if (daysUntilExpiry <= 7) {
      return <Badge variant="destructive">Expires in {daysUntilExpiry} days</Badge>
    } else if (daysUntilExpiry <= 30) {
      return (
        <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
          Expires in {daysUntilExpiry} days
        </Badge>
      )
    }
    return null
  }

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = categoryFilter === "all" || product.category.toLowerCase() === categoryFilter
    const matchesStatus = statusFilter === "all" || product.status === statusFilter
    return matchesSearch && matchesCategory && matchesStatus
  })

  const ProductDetailsModal = ({ product, isOpen, onClose }: { product: Product | null; isOpen: boolean; onClose: () => void }) => {
    if (!product) return null

    const stockHistory = [
      {
        date: "2024-01-15",
        action: "Stock In",
        quantity: +7,
        batch: "OFC-001-B002",
        reference: "PO-001",
        user: "John Doe",
      },
      {
        date: "2024-01-12",
        action: "Stock Out",
        quantity: -3,
        batch: "OFC-001-B001",
        reference: "SO-001",
        user: "Jane Smith",
      },
      {
        date: "2024-01-10",
        action: "Stock In",
        quantity: +8,
        batch: "OFC-001-B001",
        reference: "PO-002",
        user: "Mike Johnson",
      },
      {
        date: "2024-01-05",
        action: "Adjustment",
        quantity: +2,
        batch: "OFC-001-B001",
        reference: "ADJ-001",
        user: "Sarah Wilson",
      },
    ]

    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              {product.name}
            </DialogTitle>
            <DialogDescription>Product details, pricing, and batch information</DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="pricing">Price Tiers</TabsTrigger>
              <TabsTrigger value="batches">Batches</TabsTrigger>
              <TabsTrigger value="history">Stock History</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Product Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">SKU:</span>
                      <span className="font-medium">{product.sku}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Category:</span>
                      <span className="font-medium">{product.category}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Supplier:</span>
                      <span className="font-medium">{product.supplier}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Unit:</span>
                      <span className="font-medium">{product.unit}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Reorder Level:</span>
                      <span className="font-medium">{product.reorderLevel}</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Current Stock</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="text-center">
                      <div className="text-3xl font-bold">{product.stock}</div>
                      <div className="text-muted-foreground">{product.unit} available</div>
                    </div>
                    <div className="flex justify-center">
                      {getStatusBadge(product.status, product.stock, product.reorderLevel)}
                    </div>
                    <div className="text-center text-sm text-muted-foreground">Last updated: {product.lastUpdated}</div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="pricing">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Price Tiers</CardTitle>
                  <CardDescription>Pricing based on quantity levels</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Quantity Range</TableHead>
                        <TableHead>Unit Price</TableHead>
                        <TableHead>Discount</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {product.priceTiers.map((tier: { quantity: string; price: number }, index: number) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">{tier.quantity}</TableCell>
                          <TableCell>${tier.price.toFixed(2)}</TableCell>
                          <TableCell>
                            {index > 0 ? (
                              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                {(
                                  ((product.priceTiers[0].price - tier.price) / product.priceTiers[0].price) *
                                  100
                                ).toFixed(1)}
                                % off
                              </Badge>
                            ) : (
                              <span className="text-muted-foreground">Base price</span>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="batches">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Batch Information</CardTitle>
                  <CardDescription>Track product batches and expiration dates</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Batch #</TableHead>
                        <TableHead>Quantity</TableHead>
                        <TableHead>Received Date</TableHead>
                        <TableHead>Expiry Date</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {product.batches.map((batch: { batch: string; quantity: number; expiry?: string | null; received: string }, index: number) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">{batch.batch}</TableCell>
                          <TableCell>
                            {batch.quantity} {product.unit}
                          </TableCell>
                          <TableCell>{batch.received}</TableCell>
                          <TableCell>
                            {batch.expiry ? (
                              <div className="flex items-center gap-2">
                                <Calendar className="h-3 w-3" />
                                {batch.expiry}
                              </div>
                            ) : (
                              <span className="text-muted-foreground">No expiry</span>
                            )}
                          </TableCell>
                          <TableCell>
                            {batch.expiry ? (
                              getExpiryBadge(batch.expiry)
                            ) : (
                              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                                Active
                              </Badge>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="history">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Stock History</CardTitle>
                  <CardDescription>Recent stock movements and adjustments</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Action</TableHead>
                        <TableHead>Quantity</TableHead>
                        <TableHead>Batch</TableHead>
                        <TableHead>Reference</TableHead>
                        <TableHead>User</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {stockHistory.map((entry, index) => (
                        <TableRow key={index}>
                          <TableCell>{entry.date}</TableCell>
                          <TableCell>{entry.action}</TableCell>
                          <TableCell className={entry.quantity > 0 ? "text-green-600" : "text-red-600"}>
                            {entry.quantity > 0 ? "+" : ""}
                            {entry.quantity}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="font-mono text-xs">
                              {entry.batch}
                            </Badge>
                          </TableCell>
                          <TableCell>{entry.reference}</TableCell>
                          <TableCell>{entry.user}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <DialogFooter>
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
            <Button>
              <Edit className="h-4 w-4 mr-2" />
              Edit Product
            </Button>
            <Button variant="outline">Adjust Stock</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Inventory Management</h2>
          <p className="text-muted-foreground">Track products, batches, and stock levels</p>
        </div>

        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add New Product
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Product</DialogTitle>
              <DialogDescription>Add a new product to your inventory</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="product-name">Product Name</Label>
                  <Input id="product-name" placeholder="Enter product name" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sku">SKU</Label>
                  <Input id="sku" placeholder="Enter SKU" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="furniture">Furniture</SelectItem>
                      <SelectItem value="electronics">Electronics</SelectItem>
                      <SelectItem value="stationery">Stationery</SelectItem>
                      <SelectItem value="health-safety">Health & Safety</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="supplier">Supplier</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select supplier" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="office-depot">Office Depot Inc.</SelectItem>
                      <SelectItem value="tech-solutions">Tech Solutions Ltd.</SelectItem>
                      <SelectItem value="furniture-world">Furniture World</SelectItem>
                      <SelectItem value="supply-chain">Supply Chain Co.</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="initial-stock">Initial Stock</Label>
                  <Input id="initial-stock" type="number" placeholder="0" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="unit">Unit</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Unit" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pcs">Pieces</SelectItem>
                      <SelectItem value="box">Box</SelectItem>
                      <SelectItem value="kg">Kilogram</SelectItem>
                      <SelectItem value="liter">Liter</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reorder-level">Reorder Level</Label>
                  <Input id="reorder-level" type="number" placeholder="10" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" placeholder="Product description (optional)" />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => setIsAddDialogOpen(false)}>Add Product</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div>
              <CardTitle>Product Inventory</CardTitle>
              <CardDescription>Manage your product stock levels and batches</CardDescription>
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-64">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="furniture">Furniture</SelectItem>
                  <SelectItem value="electronics">Electronics</SelectItem>
                  <SelectItem value="stationery">Stationery</SelectItem>
                  <SelectItem value="health & safety">Health & Safety</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-32">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="in-stock">In Stock</SelectItem>
                  <SelectItem value="low">Low Stock</SelectItem>
                  <SelectItem value="out-of-stock">Out of Stock</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading && <p>Loading inventory...</p>}
          {error && <p style={{ color: "red" }}>{error}</p>}
          {!loading && !error && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product Name</TableHead>
                  <TableHead>SKU</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Stock Qty</TableHead>
                  <TableHead>UOM</TableHead>
                  <TableHead>Price Range</TableHead>
                  <TableHead>Batches</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell>{product.sku}</TableCell>
                    <TableCell>{typeof product.category === 'string' ? product.category : product.category?.name || 'N/A'}</TableCell>
                    <TableCell className="font-medium">{product.stock}</TableCell>
                    <TableCell>{product.unit}</TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>
                          {product.priceTiers.length > 0
                            ? `$${product.priceTiers[product.priceTiers.length - 1].price.toFixed(2)} - $${product.priceTiers[0].price.toFixed(2)}`
                            : 'N/A'}
                        </div>
                        <div className="text-muted-foreground">{(product.priceTiers || []).length} tiers</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <span className="text-sm font-medium">{(product.batches || []).length} batches</span>
                        {product.batches.some((batch) => batch.expiry) && (
                          <div className="text-xs">
                            {
                              product.batches
                                .filter((batch) => batch.expiry)
                                .map((batch) => getExpiryBadge(batch.expiry ?? null))
                                .filter(Boolean)[0]
                            }
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(product.status, product.stock, product.reorderLevel)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="sm" onClick={() => setSelectedProduct(product)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <ProductDetailsModal
        product={selectedProduct}
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
    </div>
  )
}
