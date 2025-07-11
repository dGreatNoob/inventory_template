"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Progress } from "@/components/ui/progress"
import { QrCode, Package, CheckCircle, ArrowRight, ArrowLeft, Camera } from "lucide-react"

export function StockIn() {
  const [currentStep, setCurrentStep] = useState(1)
  const [scannedPO, setScannedPO] = useState("")
  const [selectedPO, setSelectedPO] = useState(null)

  const steps = [
    { id: 1, title: "Scan QR Code", description: "Scan PO QR code or enter manually" },
    { id: 2, title: "Review Items", description: "Review items in the purchase order" },
    { id: 3, title: "Input Quantities", description: "Record received quantities and condition" },
    { id: 4, title: "Confirm & Submit", description: "Review and submit stock-in record" },
  ]

  const mockPOItems = [
    { id: 1, name: "Office Chair - Ergonomic", sku: "OFC-001", ordered: 5, unit: "pcs", unitPrice: 150.0 },
    { id: 2, name: "Desk Lamp - LED", sku: "DL-002", ordered: 10, unit: "pcs", unitPrice: 45.0 },
    { id: 3, name: "Notebook - A4", sku: "NB-003", ordered: 50, unit: "pcs", unitPrice: 3.5 },
    { id: 4, name: "Pen Set - Blue", sku: "PS-004", ordered: 20, unit: "sets", unitPrice: 12.0 },
  ]

  const [receivedItems, setReceivedItems] = useState(
    mockPOItems.map((item) => ({
      ...item,
      received: item.ordered,
      damaged: 0,
      remarks: "",
    })),
  )

  const progress = (currentStep / steps.length) * 100

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleQuantityChange = (itemId: number, field: string, value: number) => {
    setReceivedItems((prev) => prev.map((item) => (item.id === itemId ? { ...item, [field]: value } : item)))
  }

  const handleRemarksChange = (itemId: number, remarks: string) => {
    setReceivedItems((prev) => prev.map((item) => (item.id === itemId ? { ...item, remarks } : item)))
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center space-y-4">
              <div className="mx-auto w-32 h-32 border-2 border-dashed border-muted-foreground rounded-lg flex items-center justify-center">
                <QrCode className="h-16 w-16 text-muted-foreground" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Scan Purchase Order QR Code</h3>
                <p className="text-muted-foreground">Position the QR code within the frame to scan</p>
              </div>
              <Button className="flex items-center gap-2">
                <Camera className="h-4 w-4" />
                Open Camera
              </Button>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">Or enter manually</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="po-number">Purchase Order Number</Label>
              <Input
                id="po-number"
                placeholder="Enter PO number (e.g., PO-001)"
                value={scannedPO}
                onChange={(e) => setScannedPO(e.target.value)}
              />
            </div>

            {scannedPO && (
              <div className="p-4 border rounded-lg bg-green-50 border-green-200">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span className="font-medium text-green-800">PO Found: {scannedPO}</span>
                </div>
                <p className="text-sm text-green-700 mt-1">Supplier: Tech Solutions Ltd. | Date: 2024-01-14</p>
              </div>
            )}
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold">Review Purchase Order Items</h3>
              <p className="text-muted-foreground">Verify the items in purchase order {scannedPO || "PO-001"}</p>
            </div>

            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item Name</TableHead>
                    <TableHead>SKU</TableHead>
                    <TableHead>Ordered Qty</TableHead>
                    <TableHead>Unit</TableHead>
                    <TableHead>Unit Price</TableHead>
                    <TableHead>Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockPOItems.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell>{item.sku}</TableCell>
                      <TableCell>{item.ordered}</TableCell>
                      <TableCell>{item.unit}</TableCell>
                      <TableCell>${item.unitPrice.toFixed(2)}</TableCell>
                      <TableCell>${(item.ordered * item.unitPrice).toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div className="p-4 bg-muted rounded-lg">
              <div className="flex justify-between items-center">
                <span className="font-medium">Total Order Value:</span>
                <span className="text-xl font-bold">
                  ${mockPOItems.reduce((sum, item) => sum + item.ordered * item.unitPrice, 0).toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold">Record Received Quantities</h3>
              <p className="text-muted-foreground">Enter the actual quantities received and note any damages</p>
            </div>

            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item</TableHead>
                    <TableHead>Ordered</TableHead>
                    <TableHead>Received</TableHead>
                    <TableHead>Damaged</TableHead>
                    <TableHead>Remarks</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {receivedItems.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{item.name}</div>
                          <div className="text-sm text-muted-foreground">{item.sku}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {item.ordered} {item.unit}
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          value={item.received}
                          onChange={(e) =>
                            handleQuantityChange(item.id, "received", Number.parseInt(e.target.value) || 0)
                          }
                          className="w-20"
                          min="0"
                          max={item.ordered}
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          value={item.damaged}
                          onChange={(e) =>
                            handleQuantityChange(item.id, "damaged", Number.parseInt(e.target.value) || 0)
                          }
                          className="w-20"
                          min="0"
                          max={item.received}
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          placeholder="Optional remarks"
                          value={item.remarks}
                          onChange={(e) => handleRemarksChange(item.id, e.target.value)}
                          className="w-40"
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {receivedItems.reduce((sum, item) => sum + item.received, 0)}
                    </div>
                    <div className="text-sm text-muted-foreground">Total Received</div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-600">
                      {receivedItems.reduce((sum, item) => sum + item.damaged, 0)}
                    </div>
                    <div className="text-sm text-muted-foreground">Total Damaged</div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {receivedItems.reduce((sum, item) => sum + (item.received - item.damaged), 0)}
                    </div>
                    <div className="text-sm text-muted-foreground">Net Stock</div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )

      case 4:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold">Confirm Stock-In Details</h3>
              <p className="text-muted-foreground">Review all details before submitting the stock-in record</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Purchase Order Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">PO Number:</span>
                    <span className="font-medium">{scannedPO || "PO-001"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Supplier:</span>
                    <span className="font-medium">Tech Solutions Ltd.</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Date:</span>
                    <span className="font-medium">2024-01-14</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Received By:</span>
                    <span className="font-medium">John Doe</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Stock-In Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Items:</span>
                    <span className="font-medium">{receivedItems.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Received:</span>
                    <span className="font-medium text-green-600">
                      {receivedItems.reduce((sum, item) => sum + item.received, 0)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Damaged:</span>
                    <span className="font-medium text-red-600">
                      {receivedItems.reduce((sum, item) => sum + item.damaged, 0)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Net Stock Added:</span>
                    <span className="font-medium text-blue-600">
                      {receivedItems.reduce((sum, item) => sum + (item.received - item.damaged), 0)}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Items Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Item</TableHead>
                      <TableHead>Ordered</TableHead>
                      <TableHead>Received</TableHead>
                      <TableHead>Damaged</TableHead>
                      <TableHead>Net</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {receivedItems.map((item) => {
                      const isComplete = item.received === item.ordered
                      const hasIssues = item.damaged > 0 || item.received < item.ordered

                      return (
                        <TableRow key={item.id}>
                          <TableCell>
                            <div>
                              <div className="font-medium">{item.name}</div>
                              <div className="text-sm text-muted-foreground">{item.sku}</div>
                            </div>
                          </TableCell>
                          <TableCell>{item.ordered}</TableCell>
                          <TableCell>{item.received}</TableCell>
                          <TableCell>{item.damaged}</TableCell>
                          <TableCell className="font-medium">{item.received - item.damaged}</TableCell>
                          <TableCell>
                            {isComplete && !hasIssues ? (
                              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                Complete
                              </Badge>
                            ) : hasIssues ? (
                              <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                                Issues
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                                Partial
                              </Badge>
                            )}
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <div className="flex items-center space-x-2">
              <Checkbox id="confirm" />
              <Label htmlFor="confirm" className="text-sm">
                I confirm that all information is accurate and complete
              </Label>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Stock-In Process</h2>
        <p className="text-muted-foreground">Process incoming inventory from purchase orders</p>
      </div>

      {/* Progress Stepper */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">
              Step {currentStep} of {steps.length}
            </CardTitle>
            <span className="text-sm text-muted-foreground">{Math.round(progress)}% Complete</span>
          </div>
          <Progress value={progress} className="w-full" />
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center mb-6">
            {steps.map((step, index) => (
              <div key={step.id} className="flex flex-col items-center space-y-2">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    step.id === currentStep
                      ? "bg-primary text-primary-foreground"
                      : step.id < currentStep
                        ? "bg-green-500 text-white"
                        : "bg-muted text-muted-foreground"
                  }`}
                >
                  {step.id < currentStep ? <CheckCircle className="h-4 w-4" /> : step.id}
                </div>
                <div className="text-center">
                  <div className="text-sm font-medium">{step.title}</div>
                  <div className="text-xs text-muted-foreground hidden sm:block">{step.description}</div>
                </div>
              </div>
            ))}
          </div>

          {renderStepContent()}

          <div className="flex justify-between mt-8">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 1}
              className="flex items-center gap-2 bg-transparent"
            >
              <ArrowLeft className="h-4 w-4" />
              Previous
            </Button>

            {currentStep === steps.length ? (
              <Button className="flex items-center gap-2">
                <Package className="h-4 w-4" />
                Submit Stock-In
              </Button>
            ) : (
              <Button
                onClick={handleNext}
                disabled={currentStep === 1 && !scannedPO}
                className="flex items-center gap-2"
              >
                Next
                <ArrowRight className="h-4 w-4" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
