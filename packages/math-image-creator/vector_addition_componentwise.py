from manim import *

class VectorAdditionComponentwise(Scene):
    def construct(self):
        # Set up coordinate system
        axes = Axes(
            x_range=[-1, 8, 1],
            y_range=[-1, 6, 1],
            x_length=8,
            y_length=6,
            axis_config={"color": BLUE},
            tips=False,
        )
        axes_labels = axes.get_axis_labels(x_label="x", y_label="y")
        
        # Add grid
        grid = NumberPlane(
            x_range=[-1, 8, 1],
            y_range=[-1, 6, 1],
            background_line_style={
                "stroke_color": GREY,
                "stroke_width": 1,
                "stroke_opacity": 0.3
            }
        )
        
        self.play(Create(grid), Create(axes), Write(axes_labels))
        self.wait(1)
        
        # Define vectors A=(2,3) and B=(4,1)
        vector_A_coords = np.array([2, 3, 0])
        vector_B_coords = np.array([4, 1, 0])
        
        # Create vector A from origin
        vector_A = Arrow(
            start=axes.coords_to_point(0, 0),
            end=axes.coords_to_point(2, 3),
            color=RED,
            buff=0
        )
        label_A = Text("A = (2, 3)", color=RED, font_size=24)
        label_A.next_to(vector_A.get_end(), UP + RIGHT, buff=0.1)
        
        # Create vector B from origin
        vector_B = Arrow(
            start=axes.coords_to_point(0, 0),
            end=axes.coords_to_point(4, 1),
            color=GREEN,
            buff=0
        )
        label_B = Text("B = (4, 1)", color=GREEN, font_size=24)
        label_B.next_to(vector_B.get_end(), RIGHT, buff=0.1)
        
        # Show vectors A and B
        self.play(Create(vector_A), Write(label_A))
        self.wait(1)
        self.play(Create(vector_B), Write(label_B))
        self.wait(2)
        
        # Title for component-wise addition
        title = Text("Adding Vectors: Component-wise", font_size=36, color=YELLOW)
        title.to_edge(UP)
        self.play(Write(title))
        self.wait(1)
        
        # Separate x-components
        # Create Ax component (red dashed line along x-axis)
        ax_line = DashedLine(
            start=axes.coords_to_point(0, 0),
            end=axes.coords_to_point(2, 0),
            color=RED,
            stroke_width=4
        )
        ax_label = Text("Ax = 2", color=RED, font_size=20)
        ax_label.next_to(ax_line, DOWN, buff=0.2)
        
        # Create Bx component (green dashed line along x-axis)
        bx_line = DashedLine(
            start=axes.coords_to_point(2, 0),
            end=axes.coords_to_point(6, 0),
            color=GREEN,
            stroke_width=4
        )
        bx_label = Text("Bx = 4", color=GREEN, font_size=20)
        bx_label.next_to(bx_line, DOWN, buff=0.2)
        
        # Show x-components
        self.play(Create(ax_line), Write(ax_label))
        self.wait(1)
        self.play(Create(bx_line), Write(bx_label))
        self.wait(1)
        
        # Show Rx = Ax + Bx
        rx_line = Line(
            start=axes.coords_to_point(0, 0),
            end=axes.coords_to_point(6, 0),
            color=YELLOW,
            stroke_width=6
        )
        rx_label = Text("Rx = Ax + Bx = 2 + 4 = 6", color=YELLOW, font_size=20)
        rx_label.next_to(rx_line, UP, buff=0.2)
        
        self.play(Transform(ax_line.copy(), rx_line), Transform(bx_line.copy(), rx_line))
        self.play(Create(rx_line), Write(rx_label))
        self.wait(2)
        
        # Separate y-components
        # Create Ay component (red dashed line along y-axis)
        ay_line = DashedLine(
            start=axes.coords_to_point(0, 0),
            end=axes.coords_to_point(0, 3),
            color=RED,
            stroke_width=4
        )
        ay_label = Text("Ay = 3", color=RED, font_size=20)
        ay_label.next_to(ay_line, LEFT, buff=0.2)
        
        # Create By component (green dashed line along y-axis)
        by_line = DashedLine(
            start=axes.coords_to_point(0, 3),
            end=axes.coords_to_point(0, 4),
            color=GREEN,
            stroke_width=4
        )
        by_label = Text("By = 1", color=GREEN, font_size=20)
        by_label.next_to(by_line, LEFT, buff=0.2)
        
        # Show y-components
        self.play(Create(ay_line), Write(ay_label))
        self.wait(1)
        self.play(Create(by_line), Write(by_label))
        self.wait(1)
        
        # Show Ry = Ay + By
        ry_line = Line(
            start=axes.coords_to_point(0, 0),
            end=axes.coords_to_point(0, 4),
            color=YELLOW,
            stroke_width=6
        )
        ry_label = Text("Ry = Ay + By = 3 + 1 = 4", color=YELLOW, font_size=20)
        ry_label.next_to(ry_line, RIGHT, buff=0.2)
        
        self.play(Transform(ay_line.copy(), ry_line), Transform(by_line.copy(), ry_line))
        self.play(Create(ry_line), Write(ry_label))
        self.wait(2)
        
        # Display component-wise addition equations
        equations = VGroup(
            Text("Rx = Ax + Bx = 2 + 4 = 6", color=YELLOW, font_size=24),
            Text("Ry = Ay + By = 3 + 1 = 4", color=YELLOW, font_size=24)
        ).arrange(DOWN, buff=0.3)
        equations.to_edge(LEFT, buff=1).shift(UP * 2)
        
        self.play(Write(equations))
        self.wait(2)
        
        # Create resultant vector R from components
        vector_R = Arrow(
            start=axes.coords_to_point(0, 0),
            end=axes.coords_to_point(6, 4),
            color=YELLOW,
            buff=0,
            stroke_width=6
        )
        label_R = Text("R = (6, 4)", color=YELLOW, font_size=24)
        label_R.next_to(vector_R.get_end(), UP + LEFT, buff=0.1)
        
        self.play(Create(vector_R), Write(label_R))
        self.wait(1)
        
        # Show that this matches the graphical addition
        # Fade out component lines temporarily
        self.play(
            FadeOut(ax_line, bx_line, ay_line, by_line, rx_line, ry_line),
            FadeOut(ax_label, bx_label, ay_label, by_label, rx_label, ry_label)
        )
        
        # Show graphical addition (head-to-tail method)
        vector_B_shifted = Arrow(
            start=axes.coords_to_point(2, 3),
            end=axes.coords_to_point(6, 4),
            color=GREEN,
            buff=0
        )
        
        self.play(Create(vector_B_shifted))
        self.wait(1)
        
        # Emphasize that both methods yield the same result
        emphasis_text = Text("Both methods yield the same resultant vector!", 
                           font_size=24, color=YELLOW)
        emphasis_text.to_edge(DOWN, buff=1)
        
        self.play(Write(emphasis_text))
        self.wait(2)
        
        # Final summary
        summary = VGroup(
            Text("A = (2, 3)", color=RED, font_size=24),
            Text("B = (4, 1)", color=GREEN, font_size=24),
            Text("R = A + B = (6, 4)", color=YELLOW, font_size=24)
        ).arrange(DOWN, buff=0.3)
        summary.to_edge(RIGHT, buff=1).shift(UP * 1)
        
        self.play(Write(summary))
        self.wait(3)
        
        # Fade out everything
        self.play(FadeOut(*self.mobjects))
        self.wait(1)