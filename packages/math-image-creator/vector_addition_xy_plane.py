from manim import *

class VectorAdditionXYPlane(Scene):
    def construct(self):
        # Display title
        title = Text("Vector Addition on the XY Plane", font_size=48)
        title.to_edge(UP)
        self.play(Write(title))
        self.wait(1)
        
        # Create coordinate plane
        axes = Axes(
            x_range=[-6, 6, 1],
            y_range=[-4, 4, 1],
            x_length=10,
            y_length=6,
            axis_config={"color": WHITE},
            tips=False
        )
        axes_labels = axes.get_axis_labels(
            x_label=Text("X", font_size=24),
            y_label=Text("Y", font_size=24)
        )
        
        self.play(Create(axes), Write(axes_labels))
        self.wait(1)
        
        # Define vector A components
        Ax = 3
        Ay = 2
        
        # Draw vector A from origin to point (Ax, Ay)
        vector_A = Arrow(
            start=axes.coords_to_point(0, 0),
            end=axes.coords_to_point(Ax, Ay),
            color=BLUE,
            buff=0,
            stroke_width=6
        )
        
        # Label for vector A
        vector_A_label = Text("A", font_size=36, color=BLUE)
        vector_A_label.next_to(vector_A.get_end(), UP + RIGHT, buff=0.1)
        
        self.play(Create(vector_A))
        self.play(Write(vector_A_label))
        self.wait(1)
        
        # Highlight x-component (Ax)
        x_component = Arrow(
            start=axes.coords_to_point(0, 0),
            end=axes.coords_to_point(Ax, 0),
            color=GREEN,
            buff=0,
            stroke_width=4
        )
        
        x_component_label = Text("Ax", font_size=32, color=GREEN)
        x_component_label.next_to(axes.coords_to_point(Ax/2, 0), DOWN, buff=0.2)
        
        # Draw dashed line from vector end to x-axis
        x_projection = DashedLine(
            start=axes.coords_to_point(Ax, Ay),
            end=axes.coords_to_point(Ax, 0),
            color=GREEN,
            stroke_width=2
        )
        
        self.play(Create(x_component), Create(x_projection))
        self.play(Write(x_component_label))
        self.wait(1)
        
        # Highlight y-component (Ay)
        y_component = Arrow(
            start=axes.coords_to_point(0, 0),
            end=axes.coords_to_point(0, Ay),
            color=RED,
            buff=0,
            stroke_width=4
        )
        
        y_component_label = Text("Ay", font_size=32, color=RED)
        y_component_label.next_to(axes.coords_to_point(0, Ay/2), LEFT, buff=0.2)
        
        # Draw dashed line from vector end to y-axis
        y_projection = DashedLine(
            start=axes.coords_to_point(Ax, Ay),
            end=axes.coords_to_point(0, Ay),
            color=RED,
            stroke_width=2
        )
        
        self.play(Create(y_component), Create(y_projection))
        self.play(Write(y_component_label))
        self.wait(1)
        
        # Add explanation text
        explanation = Text(
            "Vectors have both magnitude and direction,\nrepresented by these components",
            font_size=28,
            color=WHITE
        )
        explanation.to_edge(DOWN)
        
        self.play(Write(explanation))
        self.wait(2)
        
        # Final pause
        self.wait(1)