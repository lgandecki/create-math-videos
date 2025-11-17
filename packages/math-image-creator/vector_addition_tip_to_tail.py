from manim import *

class VectorAdditionTipToTail(Scene):
    def construct(self):
        # Set up coordinate system
        axes = Axes(
            x_range=[-1, 6, 1],
            y_range=[-1, 5, 1],
            x_length=7,
            y_length=6,
            tips=False
        )
        axes_labels = axes.get_axis_labels(x_label="x", y_label="y")
        
        # Display coordinate system
        self.play(Create(axes), Write(axes_labels))
        self.wait(1)
        
        # Define vector coordinates
        A_end = np.array([3, 2, 0])
        B_end = np.array([2, 3, 0])
        
        # Create vector A from origin
        vector_A = Arrow(
            start=axes.coords_to_point(0, 0),
            end=axes.coords_to_point(A_end[0], A_end[1]),
            buff=0,
            color=BLUE,
            stroke_width=6
        )
        
        # Create labels for vector A
        label_A = Text("A", color=BLUE, font_size=36).next_to(vector_A.get_center(), UP)
        
        # Show vector A components
        A_components = Text("Ax = 3, Ay = 2", color=BLUE, font_size=24).to_edge(UP).shift(LEFT*2)
        
        # Animate vector A creation
        self.play(Create(vector_A), Write(label_A))
        self.play(Write(A_components))
        self.wait(1)
        
        # Create vector B from origin (initially)
        vector_B_original = Arrow(
            start=axes.coords_to_point(0, 0),
            end=axes.coords_to_point(B_end[0], B_end[1]),
            buff=0,
            color=GREEN,
            stroke_width=6
        )
        
        # Create labels for vector B
        label_B_original = Text("B", color=GREEN, font_size=36).next_to(vector_B_original.get_center(), LEFT)
        
        # Show vector B components
        B_components = Text("Bx = 2, By = 3", color=GREEN, font_size=24).next_to(A_components, DOWN)
        
        # Animate vector B creation
        self.play(Create(vector_B_original), Write(label_B_original))
        self.play(Write(B_components))
        self.wait(2)
        
        # Add title for tip-to-tail method
        title = Text("Vector Addition: Tip-to-Tail Method", font_size=36).to_edge(UP)
        self.play(
            Transform(A_components, title),
            FadeOut(B_components)
        )
        self.wait(1)
        
        # Move vector B so its tail aligns with tip of vector A
        vector_B_moved = Arrow(
            start=axes.coords_to_point(A_end[0], A_end[1]),
            end=axes.coords_to_point(A_end[0] + B_end[0], A_end[1] + B_end[1]),
            buff=0,
            color=GREEN,
            stroke_width=6
        )
        
        label_B_moved = Text("B", color=GREEN, font_size=36).next_to(vector_B_moved.get_center(), UP+RIGHT)
        
        # Animate the movement of vector B
        self.play(
            Transform(vector_B_original, vector_B_moved),
            Transform(label_B_original, label_B_moved),
            run_time=2
        )
        self.wait(1)
        
        # Create resultant vector R
        vector_R = Arrow(
            start=axes.coords_to_point(0, 0),
            end=axes.coords_to_point(A_end[0] + B_end[0], A_end[1] + B_end[1]),
            buff=0,
            color=RED,
            stroke_width=8
        )
        
        label_R = Text("R", color=RED, font_size=36).next_to(vector_R.get_center(), DOWN+RIGHT)
        
        # Animate resultant vector creation
        self.play(Create(vector_R), Write(label_R))
        self.wait(1)
        
        # Show the equation R = A + B
        equation = Text("R = A + B", color=WHITE, font_size=48).to_edge(DOWN)
        
        self.play(Write(equation))
        self.wait(1)
        
        # Show components of resultant vector
        R_components = VGroup(
            Text("Rx = Ax + Bx = 3 + 2 = 5", color=RED, font_size=28),
            Text("Ry = Ay + By = 2 + 3 = 5", color=RED, font_size=28)
        ).arrange(DOWN).next_to(equation, UP)
        
        self.play(Write(R_components))
        self.wait(3)
        
        # Highlight all vectors one more time
        self.play(
            vector_A.animate.set_stroke(width=8),
            vector_B_original.animate.set_stroke(width=8),
            vector_R.animate.set_stroke(width=10)
        )
        self.wait(2)