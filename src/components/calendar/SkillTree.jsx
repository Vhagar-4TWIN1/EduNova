import React, { useEffect, useState, useRef } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { apiRequest } from '@/lib/queryClient'
import { getConnectionStatus, onMessage } from '@/lib/websocket'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import confetti from 'canvas-confetti'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import {
  AlertCircle,
  CheckCircle2,
  Lock,
  Unlock,
  Sparkles,
  Star,
  Trophy,
} from 'lucide-react'

function SkillNodeItem({ node, onUnlock, canUnlock, isConnected }) {
  const { t } = useTranslation()
  const [isHovered, setIsHovered] = useState(false)
  const [isUnlocking, setIsUnlocking] = useState(false)
  const [showSparkles, setShowSparkles] = useState(false)
  const nodeRef = useRef(null)

  // Launch confetti when a node is successfully unlocked
  const triggerUnlockCelebration = () => {
    if (nodeRef.current) {
      const rect = nodeRef.current.getBoundingClientRect()
      const x = (rect.left + rect.width / 2) / window.innerWidth
      const y = (rect.top + rect.height / 2) / window.innerHeight

      confetti({
        particleCount: 100,
        spread: 70,
        origin: { x, y: y - 0.1 },
        colors: ['#FFD700', '#FFA500', '#32CD32', '#4169E1'],
        angle: 90,
        startVelocity: 30,
        gravity: 0.8,
        shapes: ['circle', 'square'],
      })

      setShowSparkles(true)
      setTimeout(() => setShowSparkles(false), 2000)
    }
  }

  // Card background style based on node state
  const getCardBackground = () => {
    if (node.unlocked)
      return 'bg-gradient-to-br from-primary/20 to-primary/5 shadow-[0_0_15px_rgba(var(--primary-rgb)/0.15)]'
    if (canUnlock)
      return 'bg-gradient-to-br from-amber-100/80 to-amber-50/60 shadow-md'
    return 'bg-muted/80 opacity-80'
  }

  // Handle node unlock with animation
  const handleUnlockClick = () => {
    if (node.unlocked || !isConnected || !canUnlock) return

    setIsUnlocking(true)
    onUnlock(node.id)

    // Simulate unlock animation timing
    setTimeout(() => {
      setIsUnlocking(false)
      triggerUnlockCelebration()
    }, 500)
  }

  // Motion variants for different animations
  const cardVariants = {
    initial: { scale: 0.8, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    hover: {
      scale: 1.05,
      y: -5,
      boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
    },
    unlocking: {
      scale: [1, 1.15, 1],
      rotate: [0, 2, -2, 0],
      transition: { duration: 0.5 },
    },
    unlocked: { scale: 1, opacity: 1 },
  }

  // Pulse animation for nodes that can be unlocked
  const pulseAnimation =
    canUnlock && !node.unlocked
      ? {
          scale: [1, 1.03, 1],
          boxShadow: [
            '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
            '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          ],
          transition: {
            repeat: Infinity,
            repeatType: 'reverse',
            duration: 2,
          },
        }
      : {}

  return (
    <motion.div
      ref={nodeRef}
      className="absolute"
      style={{
        left: `${node.position.x}px`,
        top: `${node.position.y}px`,
        zIndex: isHovered ? 10 : 1,
      }}
      initial="initial"
      animate={isUnlocking ? 'unlocking' : 'animate'}
      variants={cardVariants}
      whileHover="hover"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <motion.div animate={pulseAnimation}>
              <Card
                className={`w-48 ${getCardBackground()} transition-all duration-300 ease-in-out`}
                style={{
                  borderColor: node.unlocked
                    ? 'var(--primary)'
                    : canUnlock
                    ? '#f59e0b'
                    : undefined,
                  borderWidth: node.unlocked || canUnlock ? '1px' : undefined,
                }}
              >
                <CardHeader className="p-3 pb-0">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-sm font-medium group-hover:text-primary transition-colors">
                      {node.title}
                    </CardTitle>
                    <AnimatePresence mode="wait">
                      {node.unlocked ? (
                        <motion.div
                          key="unlocked"
                          initial={{ scale: 0, rotate: -180 }}
                          animate={{ scale: 1, rotate: 0 }}
                          exit={{ scale: 0 }}
                          transition={{ type: 'spring', stiffness: 500, damping: 20 }}
                        >
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                        </motion.div>
                      ) : canUnlock ? (
                        <motion.div
                          key="can-unlock"
                          initial={{ y: -10, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          exit={{ y: 10, opacity: 0 }}
                          transition={{ type: 'spring', stiffness: 500 }}
                        >
                          <AlertCircle className="h-4 w-4 text-amber-500" />
                        </motion.div>
                      ) : (
                        <motion.div
                          key="locked"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 0.7 }}
                          exit={{ opacity: 0 }}
                        >
                          <Lock className="h-4 w-4 text-gray-400" />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                  <CardDescription className="text-xs mt-1 line-clamp-2">
                    {node.description || t('skillTree.noDescription')}
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-3 pt-2">
                  <Badge
                    variant={node.unlocked ? 'secondary' : 'outline'}
                    className="text-xs"
                  >
                    {t('skillTree.level')} {node.level}
                  </Badge>

                  {/* Sparkles for newly unlocked nodes */}
                  <AnimatePresence>
                    {showSparkles && (
                      <motion.div
                        className="absolute inset-0 pointer-events-none z-10"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5 }}
                      >
                        <div className="absolute top-0 right-0">
                          <Sparkles className="h-6 w-6 text-yellow-400" />
                        </div>
                        <div className="absolute bottom-0 left-0">
                          <Star className="h-5 w-5 text-amber-400" />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </CardContent>

                {(canUnlock || node.unlocked) && (
                  <CardFooter className="p-3 pt-0">
                    <Button
                      variant={node.unlocked ? 'outline' : 'default'}
                      size="sm"
                      className={`w-full text-xs ${
                        canUnlock && !node.unlocked ? 'animate-pulse-subtle' : ''
                      }`}
                      onClick={handleUnlockClick}
                      disabled={node.unlocked || !isConnected}
                    >
                      {node.unlocked ? (
                        <motion.div
                          className="flex items-center justify-center"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.2 }}
                        >
                          {t('skillTree.unlocked')}{' '}
                          <Trophy className="ml-1 h-3 w-3 text-amber-500" />
                        </motion.div>
                      ) : (
                        <motion.div
                          className="flex items-center justify-center"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          {t('skillTree.unlock')}{' '}
                          <Unlock className="ml-1 h-3 w-3" />
                        </motion.div>
                      )}
                    </Button>
                  </CardFooter>
                )}
              </Card>
            </motion.div>
          </TooltipTrigger>
          <TooltipContent>
            <div className="max-w-xs">
              <h4 className="font-bold">{node.title}</h4>
              <p className="text-sm">{node.description}</p>
              {node.unlocked && node.unlockedAt && (
                <p className="text-xs text-muted-foreground mt-1">
                  {t('skillTree.unlockedAt')}{' '}
                  {new Date(node.unlockedAt).toLocaleDateString()}
                </p>
              )}
              {!node.unlocked && !canUnlock && (
                <p className="text-xs text-amber-500 mt-1">
                  {t('skillTree.requiresCompletion')}
                </p>
              )}
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </motion.div>
  )
}

function NodeConnections({ nodes }) {
  // Create SVG paths between connected nodes
  const paths = nodes.reduce((acc, node) => {
    if (node.parentId) {
      const parentNode = nodes.find((n) => n.id === node.parentId)
      if (parentNode) {
        // Calculate path between parent and child nodes
        const startX = parentNode.position.x + 96 // center of the parent node (192/2)
        const startY = parentNode.position.y + 60 // bottom of the parent
        const endX = node.position.x + 96 // center of child node
        const endY = node.position.y // top of child node

        // Create a curved path
        const path = `M${startX},${startY} C${startX},${startY + 40} ${endX},${
          endY - 40
        } ${endX},${endY}`

        // Determine if this connection can be unlocked (parent is unlocked but child is not)
        const canUnlock = parentNode.unlocked && !node.unlocked

        acc.push({
          path,
          unlocked: parentNode.unlocked,
          canUnlock,
          id: `${parentNode.id}-${node.id}`,
          childId: node.id,
          parentId: parentNode.id,
        })
      }
    }
    return acc
  }, [])

  return (
    <svg className="absolute top-0 left-0 w-full h-full" style={{ zIndex: 0 }}>
      {paths.map(({ path, unlocked, canUnlock, id }) => (
        <motion.path
          key={id}
          d={path}
          stroke={unlocked ? 'var(--primary)' : '#ccc'}
          strokeWidth={2}
          fill="none"
          strokeDasharray={unlocked ? 'none' : '5,5'}
          initial={{
            pathLength: 0,
            opacity: 0.2,
          }}
          animate={{
            pathLength: 1,
            opacity: 1,
            strokeWidth: canUnlock ? [2, 3, 2] : 2,
          }}
          transition={{
            duration: 1.5,
            ease: 'easeInOut',
            delay: 0.2,
            strokeWidth: {
              duration: 1.5,
              repeat: canUnlock ? Infinity : 0,
              repeatType: 'reverse',
            },
          }}
        />
      ))}

      {/* Animated particles along active paths */}
      {paths
        .filter((p) => p.unlocked)
        .map(({ path, id }) => (
          <motion.circle
            key={`particle-${id}`}
            r={3}
            fill="var(--primary)"
            filter="drop-shadow(0 0 2px var(--primary))"
            initial={{ opacity: 0 }}
            animate={{
              opacity: [0, 0.8, 0],
              offsetDistance: ['0%', '100%'],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              delay: Math.random() * 2,
              ease: 'linear',
            }}
            style={{
              offsetPath: `path("${path}")`,
              offsetRotate: '0deg',
            }}
          />
        ))}
    </svg>
  )
}

export default function SkillTree({ lessonId }) {
  const { t } = useTranslation()
  const [canUnlockMap, setCanUnlockMap] = useState({})
  const [isConnected, setIsConnected] = useState(false)

  // Query to fetch skill nodes for a course
  const {
    data: nodes = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['/api/skilltree/course', lessonId],
    queryFn: async () => {
      return await apiRequest(`/api/skilltree/course/${lessonId}`)
    },
  })

  // Mutation to unlock a node
  const unlockMutation = useMutation({
    mutationFn: async (nodeId) => {
      return await apiRequest(`/api/skilltree/node/${nodeId}/unlock`, {
        method: 'POST',
        body: { userId: '123456789012345678901234' }, // This should be the actual user ID in a real app
      })
    },
    onSuccess: () => {
      refetch()
    },
  })

  // Listen for WebSocket events
  useEffect(() => {
    const handleStatusChange = () => {
      setIsConnected(getConnectionStatus())
    }

    const handleSkillTreeUpdate = (data) => {
      if (data.lessonId === lessonId) {
        refetch()
      }
    }

    // Set initial connection state
    setIsConnected(getConnectionStatus())

    // Subscribe to WebSocket events
    onMessage('skilltree:update', handleSkillTreeUpdate)

    // Check connection periodically
    const interval = setInterval(handleStatusChange, 5000)

    // Clean up subscriptions on unmount
    return () => {
      clearInterval(interval)
    }
  }, [lessonId, refetch])

  // Check which nodes can be unlocked
  useEffect(() => {
    if (!nodes.length) return

    const checkUnlockStatus = async () => {
      const newCanUnlockMap = {}

      for (const node of nodes) {
        if (node.unlocked) continue

        try {
          const response = await apiRequest(
            `/api/skilltree/node/${node.id}/check-unlock?userId=123456789012345678901234`
          )
          newCanUnlockMap[node.id] = response.canUnlock
        } catch (error) {
          console.error(
            `Error checking unlock status for node ${node.id}:`,
            error
          )
          newCanUnlockMap[node.id] = false
        }
      }

      setCanUnlockMap(newCanUnlockMap)
    }

    checkUnlockStatus()
  }, [nodes])

  // Sort nodes by level for proper rendering
  const sortedNodes = [...nodes].sort((a, b) => a.level - b.level)

  // Handle unlocking a node
  const handleUnlock = (nodeId) => {
    unlockMutation.mutate(nodeId)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <motion.div
      className="relative w-full bg-background/80 rounded-lg border p-4 h-[600px] overflow-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <motion.div
        className="sticky top-0 z-20 bg-background/90 backdrop-blur mb-4 pb-2 border-b"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <motion.h2
          className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
        >
          {t('skillTree.title')}
        </motion.h2>
        <motion.p
          className="text-sm text-muted-foreground"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.4 }}
        >
          {t('skillTree.description')}
        </motion.p>
        <motion.div
          className="flex gap-2 mt-2"
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.4 }}
        >
          <Badge variant="outline" className="bg-primary/10 animate-glow">
            <motion.span
              initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.6, type: 'spring', stiffness: 500 }}
            >
              {t('skillTree.unlocked')}:{' '}
              {nodes.filter((node) => node.unlocked).length}
            </motion.span>
          </Badge>
          <Badge variant="outline" className="bg-muted">
            {t('skillTree.locked')}:{' '}
            {nodes.filter((node) => !node.unlocked).length}
          </Badge>
          <Badge
            variant="outline"
            className={
              isConnected ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }
          >
            {isConnected ? (
              <motion.span
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 5 }}
              >
                {t('api.connected')}
              </motion.span>
            ) : (
              t('api.disconnected')
            )}
          </Badge>
        </motion.div>
      </motion.div>

      <div className="relative" style={{ height: '800px', width: '1000px' }}>
        {sortedNodes.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            <NodeConnections nodes={sortedNodes} />
            <AnimatePresence>
              {sortedNodes.map((node, index) => (
                <motion.div
                  key={node.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{
                    delay: 0.7 + index * 0.05,
                    type: 'spring',
                    stiffness: 100,
                  }}
                >
                  <SkillNodeItem
                    node={node}
                    onUnlock={handleUnlock}
                    canUnlock={!!canUnlockMap[node.id]}
                    isConnected={isConnected}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          <motion.div
            className="flex items-center justify-center h-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <motion.div
              className="text-center"
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{
                delay: 0.4,
                type: 'spring',
                stiffness: 100,
              }}
            >
              <p className="text-muted-foreground mb-2">
                {t('skillTree.empty')}
              </p>
              <div className="text-4xl text-muted-foreground/50 animate-float">
                <Sparkles className="h-16 w-16 mx-auto" />
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}
