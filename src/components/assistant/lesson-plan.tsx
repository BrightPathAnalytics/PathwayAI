
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Define LessonPlan interface
export interface LessonPlan {
  title: string;
  grade_level: string;
  duration: string;
  objectives: string[];
  materials: string[];
  activities: { name: string; duration: string }[];
}

interface LessonPlanCardProps {
  plan: LessonPlan;
}

/**
 * Component for rendering a structured lesson plan
 * Displays the lesson plan in a card format with sections for objectives, materials, and activities
 */
export function LessonPlanCard({ plan }: LessonPlanCardProps) {
  return (
    <Card className="w-full mt-2">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>{plan.title}</CardTitle>
            <CardDescription>
              <div className="flex gap-2 mt-1">
                <Badge variant="outline">{plan.grade_level}</Badge>
                <Badge variant="outline">{plan.duration}</Badge>
              </div>
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Objectives Section */}
          <div>
            <h4 className="font-medium text-sm text-muted-foreground mb-2">Objectives</h4>
            <ul className="list-disc pl-5 space-y-1">
              {plan.objectives.map((objective, index) => (
                <li key={index} className="text-sm">{objective}</li>
              ))}
            </ul>
          </div>
          
          {/* Materials Section */}
          <div>
            <h4 className="font-medium text-sm text-muted-foreground mb-2">Materials</h4>
            <ul className="list-disc pl-5 space-y-1">
              {plan.materials.map((material, index) => (
                <li key={index} className="text-sm">{material}</li>
              ))}
            </ul>
          </div>
          
          {/* Activities Section */}
          <div>
            <h4 className="font-medium text-sm text-muted-foreground mb-2">Activities</h4>
            <ul className="list-disc pl-5 space-y-1">
              {plan.activities.map((activity, index) => (
                <li key={index} className="text-sm">
                  <span className="font-medium">{activity.name}</span> - {activity.duration}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 