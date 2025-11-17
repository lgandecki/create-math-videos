from manim import *

class InitialGrainGrowth(Scene):
    def construct(self):
        # Title
        title = Text("Wizualizacja Początkowego Wzrostu", font_size=40, color=BLUE)
        title.to_edge(UP)
        self.play(Write(title))
        self.wait(1)
        
        # Create a grid of squares (first 6 squares)
        squares = []
        square_size = 0.8
        start_x = -5
        y_pos = 1
        
        for i in range(6):
            square = Square(side_length=square_size, color=WHITE)
            square.move_to([start_x + i * 1.2, y_pos, 0])
            squares.append(square)
            
            # Label each square with its number
            label = Text(str(i + 1), font_size=24, color=WHITE)
            label.move_to(square.get_bottom() + DOWN * 0.3)
            squares.append(label)
        
        # Show all squares at once
        self.play(*[Create(obj) for obj in squares])
        self.wait(1)
        
        # Keep track of cumulative total
        cumulative_total = 0
        
        # Animate each square with grains
        for square_num in range(1, 7):
            grains_count = square_num ** 2
            cumulative_total += grains_count
            
            # Get the square position
            square_index = (square_num - 1) * 2  # Each square has a label, so multiply by 2
            square_pos = squares[square_index].get_center()
            
            # Show the formula
            formula = MathTex(f"{square_num}^2 = {grains_count}", font_size=36, color=YELLOW)
            formula.to_edge(LEFT, buff=0.5).shift(UP * 2)
            
            self.play(Write(formula))
            self.wait(0.5)
            
            # Create grains visualization
            grains = self.create_grains(grains_count, square_pos)
            
            # Animate grains appearing
            if grains_count <= 9:
                # For small numbers, show individual grains
                self.play(*[Create(grain) for grain in grains], run_time=1.5)
            else:
                # For larger numbers, show grains in groups
                self.play(*[Create(grain) for grain in grains], run_time=2, lag_ratio=0.1)
            
            # Show cumulative total
            cumulative_text = Text(
                f"Łączna suma: {cumulative_total} ziaren", 
                font_size=30, 
                color=GREEN
            )
            cumulative_text.to_edge(RIGHT, buff=0.5).shift(UP * 2)
            
            self.play(Write(cumulative_text))
            self.wait(1)
            
            # Clear previous texts for next iteration
            if square_num < 6:
                self.play(FadeOut(formula), FadeOut(cumulative_text))
            
            self.wait(0.5)
        
        # Final message
        final_message = Text(
            "Liczby rosną, ale nadal wydają się możliwe do opanowania",
            font_size=28,
            color=ORANGE
        )
        final_message.to_edge(DOWN, buff=0.5)
        
        self.play(Write(final_message))
        self.wait(3)
        
        # Fade out everything
        self.play(*[FadeOut(obj) for obj in self.mobjects])
    
    def create_grains(self, count, center_pos):
        """Create a visual representation of grains"""
        grains = []
        
        if count == 1:
            # Single grain
            grain = Dot(radius=0.08, color=YELLOW)
            grain.move_to(center_pos)
            grains.append(grain)
        
        elif count <= 4:
            # Small pile - arrange in a square pattern
            positions = [
                [-0.1, 0.1], [0.1, 0.1],
                [-0.1, -0.1], [0.1, -0.1]
            ]
            for i in range(count):
                grain = Dot(radius=0.06, color=YELLOW)
                grain.move_to(center_pos + np.array([positions[i][0], positions[i][1], 0]))
                grains.append(grain)
        
        elif count <= 9:
            # 3x3 grid
            for row in range(3):
                for col in range(3):
                    if len(grains) < count:
                        grain = Dot(radius=0.05, color=YELLOW)
                        x_offset = (col - 1) * 0.12
                        y_offset = (1 - row) * 0.12
                        grain.move_to(center_pos + np.array([x_offset, y_offset, 0]))
                        grains.append(grain)
        
        elif count <= 16:
            # 4x4 grid
            for row in range(4):
                for col in range(4):
                    if len(grains) < count:
                        grain = Dot(radius=0.04, color=YELLOW)
                        x_offset = (col - 1.5) * 0.1
                        y_offset = (1.5 - row) * 0.1
                        grain.move_to(center_pos + np.array([x_offset, y_offset, 0]))
                        grains.append(grain)
        
        elif count <= 25:
            # 5x5 grid
            for row in range(5):
                for col in range(5):
                    if len(grains) < count:
                        grain = Dot(radius=0.035, color=YELLOW)
                        x_offset = (col - 2) * 0.08
                        y_offset = (2 - row) * 0.08
                        grain.move_to(center_pos + np.array([x_offset, y_offset, 0]))
                        grains.append(grain)
        
        else:  # count = 36
            # 6x6 grid
            for row in range(6):
                for col in range(6):
                    if len(grains) < count:
                        grain = Dot(radius=0.03, color=YELLOW)
                        x_offset = (col - 2.5) * 0.07
                        y_offset = (2.5 - row) * 0.07
                        grain.move_to(center_pos + np.array([x_offset, y_offset, 0]))
                        grains.append(grain)
        
        return grains