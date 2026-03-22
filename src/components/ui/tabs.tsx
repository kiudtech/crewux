"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

const TabsContext = React.createContext<{
  value: string
  onValueChange: (value: string) => void
} | null>(null)

interface TabsProps {
  value: string
  onValueChange: (value: string) => void
  children: React.ReactNode
  className?: string
}

export function Tabs({ value, onValueChange, children, className }: TabsProps) {
  return (
    <TabsContext.Provider value={{ value, onValueChange }}>
      <div className={cn("w-full", className)}>
        {children}
      </div>
    </TabsContext.Provider>
  )
}

export function TabsList({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("flex flex-wrap gap-1 p-1 bg-gray-100 rounded-lg", className)}>
      {children}
    </div>
  )
}

export function TabsTrigger({ 
  value, 
  children, 
  className 
}: { 
  value: string
  children: React.ReactNode
  className?: string 
}) {
  const context = React.useContext(TabsContext)
  const isActive = context?.value === value

  return (
    <button
      onClick={() => context?.onValueChange(value)}
      className={cn(
        "px-4 py-2 text-sm font-medium rounded-md transition-all",
        isActive 
          ? "bg-white text-indigo-600 shadow-sm" 
          : "text-gray-600 hover:text-gray-900 hover:bg-gray-200",
        className
      )}
    >
      {children}
    </button>
  )
}

export function TabsContent({ 
  value, 
  children 
}: { 
  value: string
  children: React.ReactNode 
}) {
  const context = React.useContext(TabsContext)
  
  if (context?.value !== value) return null
  
  return <div>{children}</div>
}