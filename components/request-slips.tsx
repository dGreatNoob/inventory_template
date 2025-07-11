"use client"

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
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
import { Plus, Search, Filter, Eye, Edit, Trash2 } from "lucide-react"

interface RequestSlipItemForm {
  product_id: number;
  quantity: number;
  purpose?: string;
  notes?: string;
  name?: string; // for display only
}

interface RequestSlipForm {
  slip_number: string;
  request_date: string;
  requested_by: string;
  department: string;
  purpose: string;
  status: string;
  approved_by?: string;
  approved_date?: string;
  notes?: string;
  items: RequestSlipItemForm[];
}

export function RequestSlips() {
  const [requestSlips, setRequestSlips] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [products, setProducts] = useState<any[]>([]);
  const [form, setForm] = useState<RequestSlipForm>({
    slip_number: "",
    request_date: new Date().toISOString().slice(0, 10),
    requested_by: "John Doe",
    department: "IT",
    purpose: "",
    status: "pending",
    items: [],
  });
  const [itemDraft, setItemDraft] = useState<RequestSlipItemForm>({ product_id: 0, quantity: 1, purpose: "", notes: "" });
  const [creating, setCreating] = useState(false);
  const [formError, setFormError] = useState("");

  useEffect(() => {
    fetchRequestSlips();
    fetchProducts();
  }, []);

  async function fetchRequestSlips() {
    setLoading(true);
    try {
      const res = await api.get("/request-slips");
      setRequestSlips(res.data.data || []);
    } catch (e: any) {
      setError(e?.response?.data?.message || "Failed to fetch request slips");
    } finally {
      setLoading(false);
    }
  }

  async function fetchProducts() {
    try {
      // You may have a dedicated endpoint for products, or use /products
      const res = await api.get("/products");
      setProducts(res.data.data || []);
    } catch {
      setProducts([]);
    }
  }

  function handleAddItem() {
    if (!itemDraft.product_id || !itemDraft.quantity) return;
    const product = products.find(p => p.id === itemDraft.product_id);
    setForm(f => ({
      ...f,
      items: [
        ...f.items,
        { ...itemDraft, name: product?.name || "" },
      ],
    }));
    setItemDraft({ product_id: 0, quantity: 1, purpose: "", notes: "" });
  }

  function handleRemoveItem(idx: number) {
    setForm(f => ({ ...f, items: f.items.filter((_, i) => i !== idx) }));
  }

  async function handleCreateSlip() {
    setCreating(true);
    setFormError("");
    // Basic validation
    if (!form.slip_number || !form.requested_by || !form.department || !form.purpose || form.items.length === 0) {
      setFormError("Please fill all required fields and add at least one item.");
      setCreating(false);
      return;
    }
    try {
      const payload = {
        ...form,
        items: form.items.map(({ name, ...rest }) => rest), // remove display-only fields
      };
      await api.post("/request-slips", payload);
      setIsCreateDialogOpen(false);
      setForm({
        slip_number: "",
        request_date: new Date().toISOString().slice(0, 10),
        requested_by: "John Doe",
        department: "IT",
        purpose: "",
        status: "pending",
        items: [],
      });
      fetchRequestSlips();
    } catch (e: any) {
      setFormError(e?.response?.data?.message || "Failed to create request slip");
    } finally {
      setCreating(false);
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
            Pending
          </Badge>
        )
      case "approved":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            Approved
          </Badge>
        )
      case "rejected":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            Rejected
          </Badge>
        )
      default:
        return <Badge variant="secondary">Unknown</Badge>
    }
  }

  const filteredRequests = requestSlips.filter((request) => {
    const matchesSearch =
      request.requested_by?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.department?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.purpose?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.slip_number?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || request.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Request Slips</h2>
          <p className="text-muted-foreground">Manage and track purchase request slips</p>
        </div>

        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Create Request Slip
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Request Slip</DialogTitle>
              <DialogDescription>Fill in the details for your purchase request</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="requester">Requester</Label>
                  <Input id="requester" value="John Doe" disabled />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="department">Department</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="it">IT</SelectItem>
                      <SelectItem value="hr">HR</SelectItem>
                      <SelectItem value="finance">Finance</SelectItem>
                      <SelectItem value="marketing">Marketing</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="purpose">Purpose</Label>
                <Textarea id="purpose" placeholder="Describe the purpose of this request" />
              </div>
              <div className="space-y-2">
                <Label>Items</Label>
                <div className="border rounded-lg p-4 space-y-3">
                  <div className="grid grid-cols-12 gap-2 text-sm font-medium text-muted-foreground">
                    <div className="col-span-4">Item Name/SKU</div>
                    <div className="col-span-2">Qty</div>
                    <div className="col-span-2">Unit</div>
                    <div className="col-span-3">Remarks</div>
                    <div className="col-span-1">Action</div>
                  </div>
                  <div className="grid grid-cols-12 gap-2">
                    <Input className="col-span-4" placeholder="Enter item name or SKU" />
                    <Input className="col-span-2" type="number" placeholder="1" />
                    <Select>
                      <SelectTrigger className="col-span-2">
                        <SelectValue placeholder="Unit" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pcs">Pcs</SelectItem>
                        <SelectItem value="box">Box</SelectItem>
                        <SelectItem value="kg">Kg</SelectItem>
                        <SelectItem value="liter">Liter</SelectItem>
                      </SelectContent>
                    </Select>
                    <Input className="col-span-3" placeholder="Optional remarks" />
                    <Button variant="outline" size="sm" className="col-span-1 bg-transparent">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <Button variant="outline" size="sm" className="w-full bg-transparent">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Item
                  </Button>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => setIsCreateDialogOpen(false)}>Submit Request</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div>
              <CardTitle>All Request Slips</CardTitle>
              <CardDescription>View and manage all purchase requests</CardDescription>
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-64">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search requests..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-32">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Request #</TableHead>
                <TableHead>Requester</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Purpose</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Items</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRequests.map((request) => (
                <TableRow key={request.id}>
                  <TableCell className="font-medium">{request.id}</TableCell>
                  <TableCell>{request.requester}</TableCell>
                  <TableCell>{request.department}</TableCell>
                  <TableCell>{request.purpose}</TableCell>
                  <TableCell>{getStatusBadge(request.status)}</TableCell>
                  <TableCell>{request.date}</TableCell>
                  <TableCell>{request.items} items</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="sm">
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
        </CardContent>
      </Card>
    </div>
  )
}
